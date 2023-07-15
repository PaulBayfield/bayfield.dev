from flask import Flask, Response, request, session, redirect, url_for, send_from_directory


import time
import functools

from pathlib import Path


class API(Flask):
    """
    A subclass of Flask that adds a decorator for routes that handles errors and logging.
    """
    def __init__(self, import_name):
        Flask.__init__(self, import_name=import_name, template_folder="../templates", static_folder="../static")


        @self.errorhandler(500)
        def error_handler_500(error):
            with open(f"{str(Path(__file__).parent.parent)}/logging/errors.log", 'a') as output:
                output.write(f"ERROR 500: {error}\n")

            return Response(f"Something went wrong, I will try to fix this as soon as possible!", status=500)
        

        @self.errorhandler(404)
        def error_handler_404(error):
            return redirect("https://bayfield.dev")


        @self.website_route(path="/favicon.ico", method=["GET", "POST"], log_file="logging/website.log")
        def favicon():
            return send_from_directory(f"{str(Path(__file__).parent.parent)}/static", "favicon.ico", mimetype='image/vnd.microsoft.icon')


        @self.website_route(path="/favicon.ico", method=["GET", "POST"], subdomain="youtube", log_file="logging/website.log")
        def youtube_favicon():
            return send_from_directory(f"{str(Path(__file__).parent.parent)}/static", "favicon.ico", mimetype='image/vnd.microsoft.icon')
        

        @self.website_route(path="/favicon.ico", method=["GET", "POST"], subdomain="saintthibault", log_file="logging/website.log")
        def saintthibault_favicon():
            return send_from_directory(f"{str(Path(__file__).parent.parent)}/static", "favicon.ico", mimetype='image/vnd.microsoft.icon')


    def website_route(self, path, method: str or list = "GET", log_file: str = None, subdomain: str = None):
        """
        A decorator for routes that handles errors and logging.
        
        :param path: The path of the route.
        :param method: The method of the route.
        :param log_file: The file to log to.
        :param subdomain: The subdomain of the route.
        :return: The decorated function.
        """
        def decorator(func):
            @self.route(rule=path, methods=list(method), subdomain=subdomain)
            @functools.wraps(func)
            def decorated_function(*args, **kwargs):
                if log_file is not None:
                    log = f"{str(Path(__file__).parent.parent)}/{log_file}"
                else:
                    log = None

                response = self.handle_route(func, *args, **kwargs)

                # LOGGING
                if log:
                    self.logging(log_file=log, session=session.get("username"), session_id=request.cookies.get("session"))

                return response
            return decorated_function
        return decorator


    def handle_route(self, f: Flask, *args, **kwargs) -> Response:
        """
        A function that handles errors and logging for routes.
        
        :param f: The function to handle.
        :param args: The arguments to pass to the function.
        :param kwargs: The keyword arguments to pass to the function.
        :return: The response of the function.
        """
        try:
            response = f(*args, **kwargs)
            if response is None:
                raise TypeError(f"The view function for {f.__name__} did not return a valid response. "
                                f"The function either returned None or ended without a return statement.")
            return response
        except Exception as error:
            return Response(f"Error: {error}", status=500)

    
    def logging(self, log_file: str, session: str, session_id: str) -> None:
        """
        A function that logs requests to a file.
        
        :param log_file: The file to log to.
        :param session: The session of the request.
        :param session_id: The session ID of the request.
        :return: None
        """
        path = f"{request.base_url.replace('https://', '').replace('http://', '').split('/')[0]}{request.full_path}"
        
        log_string_date_time = f"{dict(request.headers).get('X-Forwarded-For', request.remote_addr)} - [{time.strftime('%d-%m-%Y %H:%M:%S', time.gmtime())}] \""
        log_string_path = f"{str(request.scheme).upper()} {request.method} {path}"

        ses = ""
        if session is not None: 
            ses += f" | {session}"
        if session_id is not None:
            ses += f" ({session_id})"

        with open(log_file, 'a') as output:
            output.write(f"{log_string_date_time}{log_string_path}{ses}\"\n")
