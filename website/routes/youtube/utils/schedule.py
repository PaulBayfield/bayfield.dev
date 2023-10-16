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

        with open(f"{os.getcwd()}/logging/schedule.log", 'a+') as output:
            output.write(f"\n\nLoading job...\nDirectory: {directory}\n")

        scheduler = BackgroundScheduler()
        scheduler.add_job(func=self.cleanFolder, trigger="interval", seconds=1800)
        scheduler.start()

        with open(f"{os.getcwd()}/logging/schedule.log", 'a') as output:
            output.write(f"Job started!\n")

        # Run on startup
        self.cleanFolder()


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
                    output.write(f"Deleted: {path} ({str(date)})\n")
