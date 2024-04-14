from quart import Response, url_for, request, session

from .log import logging
from .respond import Respond
from .auth import Auth, USER, ADMIN


import time
import functools

from typing import Coroutine, Union


def APIRoute(self, app, uri, method: list = ["GET"], log_file: str = None, subdomain: str = None, auth: Union[USER, ADMIN, None] = None) -> Coroutine: # type: ignore
    """
    Decorator for Web routes

    :param self: The blueprint object
    :param app: The app
    :param uri: The path of the endpoint
    :param method: The method of the endpoint
    :param log_file: The file to log requests to
    :param subdomain: The subdomain to use for the endpoint
    :param auth: The authentication level required for the endpoint
    """
    def decorator(func):
        @self.route(rule=uri, methods=method, subdomain=subdomain)
        @functools.wraps(func)
        async def decorated_function(*args, **kwargs):
            receive_time = time.time()
            response = None

            if auth is not None:
                if auth == USER and not Auth.checkIfUser(session) or auth == ADMIN and not Auth.checkIfAdmin(session):
                    if auth == ADMIN and not Auth.checkIfAdmin(session):
                        session.clear()

                    if subdomain is not None:
                        response = Respond.redirect(url_for('internal.login', redirect=subdomain))
                    else:
                        response = Respond.redirect(url_for('internal.login'))


            if not response:
                # Handle the request
                response: Response = await handleRequest(func, app, *args, **kwargs)

            # Log the request
            if log_file is not None:
                logging(log_file=f"{app.path}/{log_file}", session=session.get("username"), session_id=request.cookies.get("session"))

            if isinstance(response, Coroutine):
                return await response
            else:
                response.headers.add(
                    "Process-Time", str(round(time.time() - receive_time, 3))
                )
                return response
        return decorated_function
    return decorator


async def handleRequest(function: Coroutine, app, *args, **kwargs):
    """
    Handle the request
    
    :param function: The function to handle the request
    :param app: The app
    :param args: The arguments to pass to the function
    :param kwargs: The keyword arguments to pass to the function
    :return: The response of the function
    """
    try:
        response = await function(*args, **kwargs)
        if response is None:
            raise TypeError(f"The view function for {function.__name__} did not return a valid response. "
                            f"The function either returned None or ended without a return statement.")
        return response
    except Exception as e:
        with open(f"{app.path}/logging/errors.log", 'a+') as f:
            f.write(f"An error occurred while processing the request: {str(e)}\n")

        return Respond.error(cause="An error occurred while processing your request.")
