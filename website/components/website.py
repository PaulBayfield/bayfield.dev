from quart import Quart, url_for

from .respond import Respond
from .route import APIRoute
from ..routes.youtube.utils.tasks import Tasks
from ..routes.youtube.utils.schedule import Schedule


from pathlib import Path
from asyncpg.pool import Pool


class Website(Quart):
    path: Path
    pool: Pool
    tasks: Tasks
    sch: Schedule

    """
    Inherited from standard Flask object
    """
    def __init__(self, import_name):
        Quart.__init__(self, import_name=import_name)


        @self.errorhandler(500)
        async def error_handler(error):
            with open(f"{self.path}/logging/website.log", 'a') as output:
                output.write(f"ERROR 500: {error}\n")

            return Respond.error(cause="Something went wrong, please try again later.")


        @self.errorhandler(404)
        async def error_handler_404(error):
            return Respond.redirect(redirect_url=url_for('portfolio.home'))


    def route(self, path, method: list = ["GET"], log_file: str = None, subdomain: str = None):
        """
        Decorator for Web routes

        :param self: The blueprint object
        :param path: The path of the endpoint
        :param method: The method of the endpoint
        :param log_file: The file to log requests to
        :param tag: The tag to use for logging
        :param subdomain: The subdomain to use for the endpoint
        """
        return APIRoute(self, path=path, method=method, log_file=log_file, subdomain=subdomain)                   
