from quart import Blueprint

from .route import APIRoute


class Bp(Blueprint):
    """
    Inherited from standard Blueprint object

    Allows for use of api features
    """
    def __init__(self, name: str, import_name: str, template_folder: str = None, static_folder: str = None, static_url_path: str = None):
        """
        Constructor for Route class
        
        :param name: The name of the blueprint
        :param import_name: The import name of the blueprint
        :param template_folder: The folder where templates are stored
        :param static_folder: The folder where static files are stored
        :param static_url_path: The url path for static files
        """
        Blueprint.__init__(self, name=name, import_name=import_name, template_folder=template_folder, static_folder=static_folder, static_url_path=static_url_path)


    def path(self, app, uri, method: list = ["GET"], log_file: str = None, subdomain: str = None, auth=None) -> APIRoute:
        """
        Decorator for Web routes

        :param self: The blueprint object
        :param uri: The path of the endpoint
        :param method: The method of the endpoint
        :param log_file: The file to log requests to
        :param tag: The tag to use for logging
        :param subdomain: The subdomain to use for the endpoint
        :param auth: The authentication level required for the endpoint
        """
        return APIRoute(self, app, uri=uri, method=method, log_file=log_file, subdomain=subdomain, auth=auth)
