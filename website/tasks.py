from .worker import Worker


from typing import Literal
from json import dumps
from time import sleep


class Tasks:
    def __init__(self):
        self.tasks = {}


    def hook(self, data: dict, uuid: str) -> None:
        """
        A function that hooks the progress of the download.
        
        :param data: The dictionary containing the progress of the download.
        :param uuid: The UUID of the task.
        :return: None
        """
        try:
            self.tasks[uuid]["status"] = data['status']
            self.tasks[uuid]["speed"] = data['_speed_str']
            self.tasks[uuid]["downloaded_bytes"] = data['_downloaded_bytes_str']
            self.tasks[uuid]["total_bytes"] = data['_total_bytes_str']
            self.tasks[uuid]["progress"] = str(round(float(data['downloaded_bytes'])/float(data['total_bytes']) * 100))
            self.tasks[uuid]["eta"] = data['eta']

            # The download is finished but not the conversion yet
            if self.tasks[uuid]["progress"] == "100":
                self.tasks[uuid]["progress"] = "99"
        except:
            # Task does not exist anymore
            pass


    def generate(self, uuid: str) -> str:
        """
        A function that generates the progress of the download.
        
        :param uuid: The UUID of the task.
        :return: The progress of the download.
        """
        run = True

        while run:
            eta = self.tasks[uuid]['eta']

            if isinstance(eta, str):
                eta = 0

            data = {
                "status": self.tasks[uuid]['status'],
                "speed": self.tasks[uuid]['speed'],
                "downloaded_bytes": self.tasks[uuid]['downloaded_bytes'],
                "total_bytes": self.tasks[uuid]['total_bytes'],
                "progress": self.tasks[uuid]['progress'],
                "eta": eta
            }

            yield f"data:{dumps(data)}\n\n"

            if data['progress'] == "100":
                run = False
            else:
                # WARNING
                # DO NOT REMOVE THE LINE OR CHANGE BELOW OR THE SERVER WILL SEND THOUSANDS OF REQUESTS PER SECOND!
                sleep(0.9)


    def getWorker(self, link: str, ydl_opts: dict, uuid: str, format: Literal["mp3", "mp4"], admin: bool, max_duration:int, path: str) -> Worker:
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
            tasks=self.tasks,
            link=link,
            ydl_opts=ydl_opts,
            uuid=uuid,
            format=format,
            admin=admin,
            max_duration=max_duration,
            path=path
        )
