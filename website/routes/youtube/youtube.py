from quart import render_template, url_for, session, request

from ...components.blueprints import Bp
from ...components.respond import Respond

from ...utils.environ import getEnvironKey

from .utils.db import *
from .utils.worker import Worker
from .utils.timeFormat import format_seconds


import os

from datetime import timedelta
from uuid import uuid4


def init(app):
    blueprint = Bp(
        name='youtube',
        import_name=__name__,
        template_folder='templates',
        static_folder='static',
        static_url_path='/static/youtube/'
    )


    """
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    ┃                                                                                                                      ┃
    ┃                                            - Youtube Downloader Routes -                                             ┃
    ┃                                                                                                                      ┃
    ┃                                                                                                                      ┃
    ┃  • youtube.bayfield.dev                                                                                              ┃
    ┃    > Home page of the Youtube Downloader.                                                                            ┃
    ┃  • youtube.bayfield.dev/login                                                                                        ┃
    ┃    > Login page.                                                                                                     ┃
    ┃  • youtube.bayfield.dev/logout                                                                                       ┃
    ┃    > Logout page.                                                                                                    ┃
    ┃  • youtube.bayfield.dev/download                                                                                     ┃
    ┃    > Download page.                                                                                                  ┃
    ┃  • youtube.bayfield.dev/video                                                                                        ┃
    ┃    > Video page.                                                                                                     ┃
    ┃  • youtube.bayfield.dev/download-video                                                                               ┃
    ┃    > (Backend) Start downloading.                                                                                    ┃
    ┃  • youtube.bayfield.dev/progress                                                                                     ┃
    ┃    > (Backend) Check the progress of a download.                                                                     ┃
    ┃  • youtube.bayfield.dev/temp                                                                                         ┃
    ┃    > (Backend) Start to download a video or audio file.                                                              ┃
    ┃                                                                                                                      ┃
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    """

    @blueprint.path(app, uri='/', method=['GET','POST'], subdomain="youtube", log_file="logging/website.log")
    async def home():
        """
        Home page of the Youtube Downloader.
        
        :return: The rendered template.
        """
        if not session.get("username"):
            return Respond.redirect(url_for('youtube.login'))
        else:
            return Respond.redirect(url_for('youtube.download'))
        

    @blueprint.path(app, uri='/login', method=['GET','POST'], subdomain="youtube", log_file="logging/website.log")
    async def login():
        """
        Login page of the Youtube Downloader.
        
        :return: The rendered template.
        """
        if session.get("username"):
            return Respond.redirect(url_for('youtube.download'))

        error = None
        if request.method == 'POST':
            form_data = await request.form

            if form_data.get('username', None) and form_data.get('password', None):
                username = form_data.get('username')
                password = form_data.get('password')

                data = await getUser(app.pool, username, password)

                if not data:
                    error = "Invalid credentials. Please try again."

                    return Respond.html(await render_template('login.html', error=error))
                else:
                    session['username'] = username
                    session['admin'] = data["admin"]

                    return Respond.redirect(url_for('youtube.download'))
            else:
                return Respond.redirect(url_for('youtube.login'))
        else:
            return Respond.html(await render_template('login.html', error=error))
    
    
    @blueprint.path(app, uri='/logout', method=['GET','POST'], subdomain="youtube", log_file="logging/website.log")
    async def logout():
        """
        Logout page of the Youtube Downloader.
        
        :return: The rendered template.
        """
        if session.get("username"):
            session.clear()

        return Respond.redirect(url_for('youtube.login'))


    @blueprint.path(app, uri='/download', method=['GET','POST'], subdomain="youtube", log_file="logging/website.log")
    async def download():
        """
        Download page of the Youtube Downloader.
        
        :return: The rendered template.
        """
        if not session.get("username"):
            return Respond.redirect(url_for('youtube.login'))

        if getEnvironKey('ADMIN_ONLY') and not session['admin']:
            if session.get("username"):
                session.clear()

            line1 = "This page is only accessible by administrators."
            line2 = "Please contact an administrator to access this page or try again later..."

            return Respond.html(await render_template('error.html', line1=line1, line2=line2))

        return Respond.html(await render_template('download.html', link=request.args.get('link', ''), duration=f"max is {str(timedelta(seconds=int(getEnvironKey('MAX_DURATION'))))}"))


    @blueprint.path(app, uri='/download-video', method=['POST'], subdomain="youtube", log_file="logging/website.log")
    async def download_video():
        """
        Backend endpoint, launches the download of the video.
        
        :return: The rendered template.
        """
        if not session.get("username"):
            return Respond.redirect(url_for('youtube.login'))
        else:
            uuid = str(uuid4())
            while await checkIfTaskExists(app.pool, uuid):
                uuid = str(uuid4())

            form_data = await request.form

            link = form_data.get('videolink', "")
            format = form_data.get('format', "").lower()

            path = f"{os.getcwd()}{getEnvironKey('DOWNLOAD_PATH')}"

            if format == "mp3":
                ydl_opts = {
                    'outtmpl': os.path.join(path, '%(id)s.%(ext)s'),      # name the file the ID of the video
                    'format': 'bestaudio[ext=mp3]/best[ext=mp3]/best',    # choice of quality
                    'extractaudio': True,                                 # only keep the audio
                    'audioformat': 'mp3',                                 # convert to mp3
                    'noplaylist': True,                                   # only download single song, not playlist
                    'merge_output_format': 'mp3',
                    'writethumbnail': True,
                    'addmetadata':True,
                    'no_warnings': True,
                    'postprocessors': [
                        {
                            'key': 'FFmpegExtractAudio',
                            'preferredcodec': 'mp3',
                            'preferredquality': '192'
                        },
                        {
                            'key': 'EmbedThumbnail',
                        },
                        {
                            'key': 'FFmpegMetadata'
                        }
                    ],
                    'quiet': True
                }
            elif format == "mp4":
                ydl_opts = {
                    'outtmpl': os.path.join(path, '%(id)s.%(ext)s'),
                    'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best',
                    'merge_output_format': 'mp4',
                    'noplaylist': True,
                    'no_warnings': True,
                    'quiet': True
                }
            elif format == "wav":
                ydl_opts = {
                    'outtmpl': os.path.join(path, '%(id)s.%(ext)s'),
                    'format': 'bestaudio/best',
                    'noplaylist': True,
                    'no_warnings': True,
                    'postprocessors': [{
                        'key': 'FFmpegExtractAudio',
                        'preferredcodec': 'wav',
                    }],
                    'quiet': True
                }
            else:
                return Respond.malformed("format")


            worker: Worker = app.tasks.getWorker(
                link=link,
                ydl_opts=ydl_opts,
                uuid=uuid,
                format=format,
                admin=session.get("admin"),
                max_duration=int(getEnvironKey('MAX_DURATION')),
                path=path
            )
            worker.start()

            return Respond.json({"uuid": uuid})


    @blueprint.path(app, uri='/progress', method=['GET'], subdomain="youtube", log_file="logging/website.log")
    async def progress():
        """
        Backend endpoint, returns the progress of the download.
        
        :return: The rendered template.
        """
        if not session.get("username"):
            return Respond.redirect(url_for('youtube.login'))

        uuid = request.args.get('uuid', None)

        if not uuid:
            return Respond.malformed("uuid")
        else:
            return Respond.event_stream(app.tasks.generate(uuid))


    @blueprint.path(app, uri='/video', method=['GET'], subdomain="youtube", log_file="logging/website.log")
    async def video():
        """
        Video page of the Youtube Downloader.
        
        :return: The rendered template.
        """
        uuid = request.args.get('id')

        if not uuid or not await checkIfTaskExists(app.pool, uuid):
            return Respond.redirect(url_for('youtube.download'))
        else:
            video = await getVideoFromUUID(app.pool, uuid)
            if not video:
                return Respond.redirect(url_for('youtube.download'))
            else:
                format = await getFormat(app.pool, video['format'])
                return Respond.html(await render_template('video.html', image=video['thumbnail'], url=video['link'], title=video['title'], rawTitle=video['title'].replace(".", " "), author=video['author'], path=f"/temp/{video['id']}.{format}", id=video['id'], delete_period=format_seconds(int(getEnvironKey('MAX_SAVE')))))


    @blueprint.path(app, uri='/temp/<path:file>', method=['GET'], subdomain="youtube", log_file="logging/website.log")
    async def temp(file: str):
        """
        Backend endpoint, returns the video.
        
        :param file: The file to download.
        :return: The video/music file.
        """
        try:
            if file.endswith('mp3'):
                mimetype = 'audio/mp3'
            elif file.endswith('mp4'):
                mimetype = 'video/mp4'
            elif file.endswith('wav'):
                mimetype = 'audio/wav'
            else:
                return Respond.malformed("format")

            p = f"{os.getcwd()}{getEnvironKey('DOWNLOAD_PATH')}/{file}"
            if not os.path.exists(p):
                return Respond.invalid(key="error", data="File not found")
            else:
                name = await getFileNameFromID(app.pool, file.split(".")[0])
                return Respond.stream(p, name=name, mimetype=mimetype)
        except: # File not found or other error
            return Respond.redirect(url_for('youtube.download'))


    return blueprint
