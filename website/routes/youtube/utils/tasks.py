from .worker import Worker
from .db import *


import asyncio

from typing import Literal, AsyncGenerator
from json import dumps


class Tasks:
    def __init__(self, app):
        self.app = app


    async def generate(self, uuid: str) -> AsyncGenerator[str, None]:
        """
        A function that generates the progress of the download.
        
        :param uuid: The UUID of the task.
        :return: The progress of the download.
        """
        run = True

        while run:
            data = await getTask(self.app.pool, uuid)

            if data is None:
                json_data = {
                    "status": "starting",
                    "speed": "0MiB/s",
                    "downloaded_bytes": "0MiB",
                    "total_bytes": "0MiB",
                    "progress": "0",
                    "eta": "0"
                }
            else:
                eta = data['eta']

                if isinstance(eta, str):
                    eta = 0

                json_data = {
                    "status": data['status'],
                    "speed": data['speed'],
                    "downloaded_bytes": data['downloaded'],
                    "total_bytes": data['total'],
                    "progress": str(data['progress']),
                    "eta": str(eta)
                }

            yield f"data:{dumps(json_data)}\n\n"

            if json_data['progress'] == "100":
                run = False
            else:
                # WARNING: DO NOT REMOVE THE LINE BELOW OR THE SERVER WILL SEND THOUSANDS OF REQUESTS PER SECOND!
                await asyncio.sleep(0.5)


    def getWorker(self, link: str, ydl_opts: dict, uuid: str, format: Literal["mp3", "mp4", "wav"], admin: bool, max_duration:int, path: str) -> Worker:
        """
        A function that returns a worker.
        
        :param link: The link of the video.
        :param ydl_opts: The options for youtube-dl.
        :param uuid: The UUID of the task.
        :param format: The format of the video.
        :param admin: Whether the user is an admin.
        :param max_duration: The maximum duration of the video.
        :param path: The path to save the video to.
        :return: The worker.
        """
        return Worker(
            link=link,
            ydl_opts=ydl_opts,
            uuid=uuid,
            format=format,
            admin=admin,
            max_duration=max_duration,
            path=path
        )
