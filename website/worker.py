import yt_dlp
import os

from threading import Thread


class Worker(Thread):
    def __init__(self, tasks, link, ydl_opts, uuid, format, admin, max_duration, path):
        Thread.__init__(self)
        self.tasks = tasks
        self.link = link
        self.ydl_opts = ydl_opts
        self.uuid = uuid
        self.format = format
        self.admin = admin
        self.max_duration = max_duration
        self.path = path


    def run(self) -> None:
        """
        Runs the worker.
        
        :return: None
        """
        with yt_dlp.YoutubeDL(self.ydl_opts) as ydl:
            try:
                info_dict = ydl.extract_info(self.link, download=False)
            except:
                self.tasks[self.uuid] = {
                    "progress": "-1"
                }
                return

            id = info_dict["id"]
            thumbnail = info_dict.get('thumbnail', '')
            title = info_dict.get('title', 'Undefined')
            author = info_dict.get('artist', 'Undefined')
            duration = info_dict.get('duration')

            if author == "Undefined" and " - " in title:
                author = title.split(" - ")[0]
                title = title.split(" - ")[1]

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

        self.tasks[self.uuid] = {
            "id": id,
            "format": self.format,
            "thumbnail": thumbnail,
            "title": title,
            "link": self.link,
            "author": author,
            "duration": duration,
            "progress": "100" if not error else "-100"
        }
