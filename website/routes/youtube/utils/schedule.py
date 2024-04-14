import os

from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime


class Schedule:
    """
    Class for scheduling tasks.
    """
    def __init__(self, directory: str, maxSave: int) -> None:
        self.directory = directory
        self.maxSave = maxSave
        self.directory2 = f"{'/'.join(self.directory.split('/')[0:-1])}/media/temporary"

        with open(f"{os.getcwd()}/logging/schedule.log", 'a+') as output:
            output.write(f"\n\nLoading job...\nDirectory: {directory}\n")

        scheduler = BackgroundScheduler()
        scheduler.add_job(func=self.cleanFolder, trigger="interval", seconds=1800)
        scheduler.start()

        with open(f"{os.getcwd()}/logging/schedule.log", 'a') as output:
            output.write(f"Job started!\n")


        with open(f"{os.getcwd()}/logging/schedule.log", 'a+') as output:
            output.write(f"\n\nLoading job...\nDirectory: {self.directory2}\n")

        scheduler2 = BackgroundScheduler()
        scheduler2.add_job(func=self.cleanTempMedias, trigger="interval", seconds=1800)
        scheduler2.start()

        with open(f"{os.getcwd()}/logging/schedule.log", 'a') as output:
            output.write(f"Job started!\n")


        # Run on startup
        self.cleanFolder()
        self.cleanTempMedias()


    def cleanFolder(self) -> None: 
        """
        A function that cleans the folder.
        """
        for filename in os.listdir(self.directory):
            path = os.path.join(self.directory, filename)
            date = datetime.fromtimestamp(os.path.getctime(path))

            if (datetime.now() - date).total_seconds() > self.maxSave:
                os.remove(path)

                with open(f"{os.getcwd()}/logging/schedule.log", 'a+') as output:
                    output.write(f"Download deleted: {path} ({str(date)})\n")


    def cleanTempMedias(self) -> None:
        """
        A function that cleans the temporary medias.
        """
        for filename in os.listdir(self.directory2):
            path = os.path.join(self.directory2, filename)
            date = datetime.fromtimestamp(os.path.getctime(path))

            if (datetime.now() - date).total_seconds() > 43_200:
                os.remove(path)

                with open(f"{os.getcwd()}/logging/schedule.log", 'a+') as output:
                    output.write(f"Media deleted: {path} ({str(date)})\n")
