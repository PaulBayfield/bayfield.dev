from ...components.blueprints import Route
from ...components.respond import Respond
from ...components.parameters import Parameter, inputs
from ...components.auth import polsu_admin_auth, polsu_owner_auth


import os

from datetime import datetime
from json import loads


def construct(app):
    route = Route(
        name='admin',
        import_name=__name__,
    )



from .tools import API
from .tasks import Tasks
from .schedule import Schedule
from .chunk import read_file_chunks
from .db import *

from flask import Response, redirect, url_for, render_template, stream_with_context, request, session
from flask_session import Session


import os
import asyncio
import asyncpg

from dotenv import load_dotenv
from uuid import uuid4
from os import environ
from datetime import timedelta
from pathlib import Path



from flask import Blueprint, render_template

products_bp = Blueprint('products_bp', __name__,
    template_folder='templates',
    static_folder='static', static_url_path='assets')



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


@app.website_route('/', method=['GET','POST'], subdomain="", log_file="logging/website.log")
async def yt_home():
    """
    Home page of the Youtube Downloader.
    
    :return: The rendered template.
    """
    if not session.get("username"):
        return redirect(url_for('login'))
    else:
        return redirect(url_for('download'))
        

@app.website_route('/login', method=['GET','POST'], subdomain="", log_file="logging/website.log")
async def login():
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

            conn = await getConnection(environ)
            data = await getUser(conn, username, password)

            if not data:
                error = "Invalid credentials. Please try again."

                return render_template('login.html', error=error)
            else:
                session['username'] = username
                session['admin'] = data["admin"]

                return redirect(url_for('download'))
        else:
            return redirect(url_for('login'))
    else:
        return render_template('login.html', error=error)
    

@app.website_route('/logout', method=['GET','POST'], subdomain="", log_file="logging/website.log")
async def logout():
    """
    Logout page of the Youtube Downloader.
    
    :return: The rendered template.
    """
    if session.get("username"):
        session.clear()

    return redirect(url_for('login'))


@app.website_route('/download', method=['GET', 'POST'], subdomain="", log_file="logging/website.log")
async def download():
    """
    Download page of the Youtube Downloader.
    
    :return: The rendered template.
    """
    if not session.get("username"):
        return redirect(url_for('login'))

    if environ['ADMIN_ONLY'] and not session['admin']:
        if session.get("username"):
            session.clear()

        error = "Contact the administrator to get access to this page."

        return render_template('login.html', error=error)

    uuid = str(uuid4())
    while uuid in app.tasks.tasks:
        uuid = str(uuid4())

    app.tasks.tasks[uuid] = {
        "status": "starting",
        "speed": "0MiB/s",
        "downloaded_bytes": "0MiB",
        "total_bytes": "0MiB",
        "progress": "0",
        "eta": 0
    }
    
    return render_template('download.html', uuid=uuid, link=request.args.get('link', ''), duration=f"max is {str(timedelta(seconds=int(environ['MAX_DURATION'])))}")


@app.website_route('/video', method=['GET'], subdomain="", log_file="logging/website.log")
async def video():
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


@app.website_route('/download-video', method=['GET', 'POST'], subdomain="", log_file="logging/website.log")
async def download_video():
    """
    Backend endpoint, launches the download of the video.
    
    :return: The rendered template.
    """
    if not session.get("username"):
        return Response("Error", status=403)

    if request.method == 'POST':
        uuid = request.args.get('id')

        link = request.form.get('videolink', "")
        format = request.form.get('format', "").lower()

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
                'outtmpl': os.path.join(path, '%(id)s.%(ext)s'),
                'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best',
                'merge_output_format': 'mp4',
                'noplaylist': True,
                'no_warnings': True,
                'progress_hooks': [lambda data: app.tasks.hook(data, uuid)],
                'quiet': True
            }
        elif format == "wav":
            ydl_opts = {
                'outtmpl': os.path.join(path, '%(id)s.%(ext)s'),
                'format': 'bestaudio/best',
                'noplaylist': True,
                'no_warnings': True,
                'progress_hooks': [lambda d: app.tasks.hook(d, uuid)],
                'postprocessors': [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'wav',
                }],
                'quiet': True
            }
        else:
            return Response("Error", status=404)

        async def run_async():
            worker = app.tasks.getWorker(
                link=link,
                ydl_opts=ydl_opts,
                uuid=uuid,
                format=format,
                admin=session.get("admin"),
                max_duration=int(environ['MAX_DURATION']),
                path=path
            )
            await asyncio.to_thread(worker.run)

        asyncio.create_task(run_async())

        return Response("Ok", status=200)
    else:
        return Response("Error", status=404)
    

@app.website_route('/progress', method=['GET'], subdomain="", log_file="logging/website.log")
async def progress():
    """
    Backend endpoint, returns the progress of the download.
    
    :return: The rendered template.
    """
    if not session.get("username"):
        return redirect(url_for('login'))

    uuid = request.args.get('uuid', '')

    if uuid not in app.tasks.tasks:
        return redirect(url_for('download'))

    return Response(app.tasks.generate(uuid), mimetype='text/event-stream', headers={'Access-Control-Allow-Origin': '*'})


@app.route('/temp/<path:path>', methods=['GET', 'POST'], subdomain="")
def temp(path: str):
#@app.website_route('/temp/<path:path>', method=['GET', 'POST'], subdomain="", log_file="logging/website.log")
#async def temp(path: str):
    """
    Backend endpoint, returns the video.
    
    :param path: The path (name) of the file to download.
    :return: The video/music file.
    """
    try:
        if path.endswith('mp3'):
            mimetype = 'audio/mp3'
        elif path.endswith('mp4'):
            mimetype = 'video/mp4'
        elif path.endswith('wav'):
            mimetype = 'audio/wav'
        else:
            raise Exception("Invalid file format")

        if not os.path.exists(f"{os.getcwd()}{environ['DOWNLOAD_PATH']}/{path}"):
            raise Exception("File not found")

        return Response(
            stream_with_context(read_file_chunks(f"{os.getcwd()}{environ['DOWNLOAD_PATH']}/{path}")),
            headers = {
                'Content-Disposition': f'attachment'
            },
            mimetype=mimetype
        )
    except: # File not found or other error
        return redirect(url_for('download'))
