from .db import *

from ....utils.environ import getEnvironKey


import yt_dlp
import os
import re
import asyncio
import psycopg

from threading import Thread
from time import time
from asyncpg import create_pool


class Worker(Thread):
    def __init__(self, link: str, ydl_opts: dict, uuid: str, format: str, admin: bool, max_duration: int, path: str):
        Thread.__init__(self)
        self.link = link
        self.ydl_opts = ydl_opts
        self.uuid = uuid
        self.format = format
        self.admin = admin
        self.max_duration = max_duration
        self.path = path

        self.update = time()

        self.ydl_opts['progress_hooks'] = [self.hook]

        self.conn = psycopg.connect(
            dbname=getEnvironKey('POSTGRES_DATABASE'),
            user=getEnvironKey('POSTGRES_USER'),
            password=getEnvironKey('POSTGRES_PASSWORD'),
            host=getEnvironKey('POSTGRES_HOST'),
            port=getEnvironKey('POSTGRES_PORT'),
            autocommit=True
        )


    def run(self):
        asyncio.run(self._run())


    async def _run(self):
        """
        Runs the worker.
        """
        self.pool = await create_pool(
            database=getEnvironKey('POSTGRES_DATABASE'),
            user=getEnvironKey('POSTGRES_USER'),
            password=getEnvironKey('POSTGRES_PASSWORD'),
            host=getEnvironKey('POSTGRES_HOST'),
            port=getEnvironKey('POSTGRES_PORT'),
        )

        with yt_dlp.YoutubeDL(self.ydl_opts) as ydl:
            try:
                info_dict = ydl.extract_info(self.link, download=False)
            except:
                id = self.link.split('v=')[1]

                await insertVideo(
                    pool=self.pool,
                    id=id,
                    thumbnail="",
                    title="",
                    link=self.link,
                    author="",
                    duration=0
                )

                return await insertTask(
                    pool=self.pool,
                    uuid=self.uuid,
                    video=id,
                    format=self.format,
                    status="error",
                    speed="0MiB/s",
                    downloaded="0MiB",
                    total="0MiB",
                    progress=-1,
                    eta=0
                )
            else:
                id = info_dict["id"]
                thumbnail = info_dict.get('thumbnail', '')
                title = info_dict.get('title', 'Undefined')
                author = info_dict.get('artist', 'Undefined')
                duration = info_dict.get('duration')

                if author == "Undefined":
                    if " - " in title:
                        author = title.split(" - ")[0]
                        title = title.split(" - ")[1]
                    else:
                        author = info_dict.get('uploader', 'Undefined')

                await insertVideo(
                    pool=self.pool,
                    id=id,
                    thumbnail=thumbnail,
                    title=title,
                    link=self.link,
                    author=author,
                    duration=duration
                )

                await insertTask(
                    pool=self.pool,
                    uuid=self.uuid,
                    video=id,
                    format=self.format,
                    status="starting",
                    speed="0MiB/s",
                    downloaded="0MiB",
                    total="0MiB",
                    progress=1,
                    eta=0
                )

            error = False
            if duration > self.max_duration:
                if self.admin:
                    if os.path.exists(f"{self.path}/{id}.{self.format}"):
                        pass
                    else:
                        ydl.download([self.link])
                else:
                    error = True
            else:
                if os.path.exists(f"{self.path}/{id}.{self.format}"):
                    pass
                else:
                    ydl.download([self.link])


        await updateTaskStatus(
            pool=self.pool,
            uuid=self.uuid,
            status="ended",
            speed="0MiB/s",
            progress=100 if not error else -100,
            eta=0
        )

        self.conn.close()


    def remove_ansi_escape_sequences(self, string: str) -> str:
        """
        A function that removes ANSI escape sequences from a string.
        
        :param string: The string to remove the ANSI escape sequences from.
        :return: The string without the ANSI escape sequences.
        """
        ansi_regex = re.compile(r'(\x9B|\x1B\[)[0-?]*[ -\/]*[@-~]')
        return ansi_regex.sub('', string).lstrip()


    def hook(self, data) -> None:
        """
        A function that hooks the progress of the download.
        
        :param data: The dictionary containing the progress of the download.
        """
        if time() - self.update < 1:
            return
        else:
            self.update = time()

            try:
                total_bytes = data['total_bytes']
                total_bytes_str = data['_total_bytes_str']

                try:
                    progress = round(float(data['downloaded_bytes'])/float(total_bytes) * 100)
                except ZeroDivisionError:
                    progress = 1
            except:
                if data.get('total_bytes_estimate', None):
                    total_bytes = data['total_bytes_estimate']
                    total_bytes_str = data['_total_bytes_estimate_str']

                    try:
                        progress = round(float(data['downloaded_bytes'])/float(total_bytes) * 100)
                    except ZeroDivisionError:
                        progress = 1
                else:
                    total_bytes = 0
                    total_bytes_str = "0MiB"

                    progress = 1

            try:
                if progress == 0:
                    progress = 1
                elif progress == 100:
                    progress = 99

                speed = self.remove_ansi_escape_sequences(data['_speed_str'])
                if speed.startswith('Unknown'):
                    speed = '0 MiB/s'

                eta = data['eta']
                if eta == "None" or eta is None:
                    eta = 0

                slowUpdateTask(
                    conn=self.conn,
                    uuid=self.uuid,
                    status=data['status'],
                    speed=speed,
                    downloaded=self.remove_ansi_escape_sequences(data['_downloaded_bytes_str']),
                    total=self.remove_ansi_escape_sequences(total_bytes_str),
                    progress=progress,
                    eta=eta
                )
            except Exception:
                # Task does not exist anymore
                pass
