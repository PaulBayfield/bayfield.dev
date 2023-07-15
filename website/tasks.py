from .worker import Worker


from typing import Literal


class Tasks:
    def __init__(self):
        self.tasks = {}


    def hook(self, d, uuid: str) -> None:
        """
        A function that hooks the progress of the download.
        
        :param d: The dictionary containing the progress of the download.
        :param uuid: The UUID of the task.
        :return: None
        """
        try:
            self.tasks[uuid]["progress"] = str(round(float(d['downloaded_bytes'])/float(d['total_bytes']) * 100))
        except:
            self.tasks[uuid]["progress"] = "100"

        if self.tasks[uuid]["progress"] == "100":
            self.tasks[uuid]["progress"] = "99"


    def generate(self, uuid: str) -> str:
        """
        A function that generates the progress of the download.
        
        :param uuid: The UUID of the task.
        :return: The progress of the download.
        """
        yield f"data:{self.tasks[uuid]['progress']}\n\n"


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
