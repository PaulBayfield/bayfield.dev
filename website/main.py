from .tools import API
from .tasks import Tasks
from .schedule import Schedule
from .chunk import read_file_chunks

from flask import Response, redirect, url_for, render_template, stream_with_context, request, session
from flask_session import Session


import os
import psycopg2

from dotenv import load_dotenv
from uuid import uuid4
from os import environ
from datetime import timedelta
from pathlib import Path


# Load the environment variables.
load_dotenv(dotenv_path=f".env")


# Create the directory for the logging and the downloads.
if not os.path.exists(f"{str(Path(__file__).parent.parent)}/logging"):
    os.makedirs(f"{str(Path(__file__).parent.parent)}/logging")

if not os.path.exists(f"{str(Path(__file__).parent.parent.parent)}/{environ['DOWNLOAD_PATH']}"):
    os.makedirs(f"{str(Path(__file__).parent.parent.parent)}/{environ['DOWNLOAD_PATH']}")


# Create the app.
app = API(__name__)
app.secret_key = str(uuid4())


# Change this depending on your domain name.
# This is mandatory to able to use subdomains.
app.config['SERVER_NAME'] = environ['DOMAIN_NAME']


# Adding the Session to the app.
app.config["SQLALCHEMY_DATABASE_URI"] = f"postgresql://{environ['POSTGRES_USER']}:{environ['POSTGRES_PASSWORD']}@{environ['POSTGRES_HOST']}:{environ['POSTGRES_PORT']}/{environ['POSTGRES_DATABASE']}"

app.config["SESSION_SQLALCHEMY_TABLE"] = "sessions"
app.config["SESSION_TYPE"] = "sqlalchemy"
app.config["SESSION_PERMANENT"] = True

Session(app)

# Create the database tables.
with app.app_context():
    app.session_interface.db.create_all()


# Create the instance for the Tasks.
app.tasks: Tasks = Tasks()


# Create the instance for the Schedule.
app.sch:Schedule = Schedule(
    directory=f"{os.getcwd()}{environ['DOWNLOAD_PATH']}",
    maxSave=int(environ['MAX_SAVE'])
)


"""
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                                                                                      ┃
┃                                                 - Portfolio Routes -                                                 ┃
┃                                                                                                                      ┃
┃                                                                                                                      ┃
┃  • bayfield.dev                                                                                                      ┃
┃    > Home page                                                                                                       ┃
┃  • www.bayfield.dev                                                                                                  ┃
┃    > redirects to bayfield.dev                                                                                       ┃
┃                                                                                                                      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
"""


@app.website_route(path='/', method=['GET','POST'], log_file="logging/website.log")
def home():
    """
    The home page of the website.
    
    :return: The rendered template.
    """
    return render_template('index.html')


@app.website_route('/', method=['GET','POST'], subdomain="www", log_file="logging/website.log")
def www():
    """
    Redirects to the home page.
    
    :return: The redirect.
    """
    return redirect(url_for('home'))



"""
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                                                                                      ┃
┃                                              - Saint Thibault Routes -                                               ┃
┃                                                                                                                      ┃
┃                                                                                                                      ┃
┃  • saintthibault.bayfield.dev                                                                                        ┃
┃    > Home page of the Saint Thibault website.                                                                        ┃
┃                                                                                                                      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
"""


@app.website_route('/', method=['GET','POST'], subdomain="saintthibault", log_file="logging/website.log")
def saintthibault_home():
    """
    The home page of the Saint Thibault website.
    
    :return: The rendered template.
    """
    return render_template('saintthibault.html')



"""
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                                                                                      ┃
┃                                              - Saint Thibault Routes -                                               ┃
┃                                                                                                                      ┃
┃                                                                                                                      ┃
┃  • youtube.bayfield.dev                                                                                              ┃
┃    > Home page of the Youtube Downloader.                                                                            ┃
┃  • youtube.bayfield.dev/login                                                                                        ┃
┃    > Login page.                                                                                                     ┃
┃  • youtube.bayfield.dev/logout                                                                                       ┃
┃    > Logout page.                                                                                                    ┃
┃  • youtube.bayfield.dev                                                                                              ┃
┃    > Download page.                                                                                                  ┃
┃                                                                                                                      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
"""


@app.website_route('/', method=['GET','POST'], subdomain="youtube", log_file="logging/website.log")
def yt_home():
    """
    Home page of the Youtube Downloader.
    
    :return: The rendered template.
    """
    if not session.get("username"):
        return redirect(url_for('login'))
    else:
        return redirect(url_for('download'))
        

@app.website_route('/login', method=['GET','POST'], subdomain="youtube", log_file="logging/website.log")
def login():
    """
    Login page of the Youtube Downloader.
    
    :return: The rendered template.
    """
    if session.get("username"):
        return redirect(url_for('download'))

    error = None
    if request.method == 'POST':
        if request.form.get('username', '') and request.form.get('password', ''):
            username = request.form['username']
            password = request.form['password']

            conn = psycopg2.connect(
                database=environ['POSTGRES_DATABASE'],
                user=environ['POSTGRES_USER'],
                password=environ['POSTGRES_PASSWORD'],
                host=environ['POSTGRES_HOST'],
                port=environ['POSTGRES_PORT']
            )
            cur = conn.cursor()
            
            cur.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, password))
            record = cur.fetchone()

            cur.close()
            conn.close()

            if not record:
                error = "Invalid credentials. Please try again."

                return render_template('login.html', error=error)
            else:
                session['username'] = username
                return redirect(url_for('download'))
        else:
            return redirect(url_for('login'))
    else:
        return render_template('login.html', error=error)
    

@app.website_route('/logout', method=['GET','POST'], subdomain="youtube", log_file="logging/website.log")
def logout():
    """
    Logout page of the Youtube Downloader.
    
    :return: The rendered template.
    """
    if session.get("username"):
        session.clear()

    return redirect(url_for('login'))


@app.website_route('/download', method=['GET', 'POST'], subdomain="youtube", log_file="logging/website.log")
def download():
    """
    Download page of the Youtube Downloader.
    
    :return: The rendered template.
    """
    if not session.get("username"):
        return redirect(url_for('login'))

    uuid = str(uuid4())
    while uuid in app.tasks.tasks:
        uuid = str(uuid4())

    app.tasks.tasks[uuid] = {
        "status": "starting...",
        "speed": "0MiB/s",
        "downloaded_bytes": "0MiB",
        "total_bytes": "0MiB",
        "progress": "0",
        "eta": 0
    }
    
    return render_template('download.html', uuid=uuid, link=request.args.get('link', ''), duration=f"max is {str(timedelta(seconds=int(environ['MAX_DURATION'])))}")


@app.website_route('/video', method=['GET'], subdomain="youtube", log_file="logging/website.log")
def video():
    """
    Video page of the Youtube Downloader.
    
    :return: The rendered template.
    """
    uuid = request.args.get('id')

    if uuid not in app.tasks.tasks:
        return redirect(url_for('download'))
    else:
        id = app.tasks.tasks[uuid]["id"]
        format = app.tasks.tasks[uuid]["format"]
        thumbnail = app.tasks.tasks[uuid]["thumbnail"]
        title = app.tasks.tasks[uuid]["title"]
        link = app.tasks.tasks[uuid]["link"]
        author = app.tasks.tasks[uuid]["author"]

        return render_template('video.html', image=thumbnail, url=link, title=title, rawTitle=title.replace(".", " "), author=author, path=f"/temp/{id}.{format}")


@app.website_route('/download-video', method=['GET', 'POST'], subdomain="youtube", log_file="logging/website.log")
def download_video():
    """
    Backend endpoint, launches the download of the video.
    
    :return: The rendered template.
    """
    if not session.get("username"):
        return Response("Error", status=403)

    if request.method == 'POST':
        uuid = request.args.get('id')

        link = request.form.get('videolink', "")
        format = request.form.get('format', "")

        path = f"{os.getcwd()}{environ['DOWNLOAD_PATH']}"

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
                'progress_hooks': [lambda d: app.tasks.hook(d, uuid)],
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
                'outtmpl': os.path.join(path, '%(id)s.mp4'),
                'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]c/best',
                'merge_output_format': 'mp4',
                'noplaylist': True,
                'no_warnings': True,
                'progress_hooks': [lambda data: app.tasks.hook(data, uuid)],
                'quiet': True
            }
        else:
            return Response("Error", status=404)

        worker = app.tasks.getWorker(
            link=link,
            ydl_opts=ydl_opts,
            uuid=uuid,
            format=format,
            admin=session.get("username") == "admin",
            max_duration=int(environ['MAX_DURATION']),
            path=path
        )
        worker.start()

        return Response("Ok", status=200)
    else:
        return Response("Error", status=404)
    

@app.website_route('/progress', method=['GET'], subdomain="youtube", log_file="logging/website.log")
def progress():
    """
    Backend endpoint, returns the progress of the download.
    
    :return: The rendered template.
    """
    if not session.get("username"):
        return redirect(url_for('login'))

    uuid = request.args.get('uuid')

    if uuid not in app.tasks.tasks:
        return redirect(url_for('download'))

    return Response(app.tasks.generate(uuid), mimetype='text/event-stream', headers={'Access-Control-Allow-Origin': '*'})


@app.website_route('/temp/<path:path>', method=['GET', 'POST'], subdomain="youtube", log_file="logging/website.log")
def temp(path: str):
    """
    Backend endpoint, returns the video.
    
    :param path: The path (name) of the file to download.
    :return: The video/music file.
    """
    try:
        print(path)

        if path.endswith('mp3'):
            mimetype = 'audio/mp3'
        elif path.endswith('mp4'):
            mimetype = 'video/mp4'
        else:
            raise Exception("Invalid file format")

        return Response(
            stream_with_context(read_file_chunks(f"{os.getcwd()}{environ['DOWNLOAD_PATH']}/{path}")),
            headers = {
                'Content-Disposition': f'attachment'
            },
            mimetype=mimetype
        )
    except: # File not found or other error
        return redirect(url_for('download'))
