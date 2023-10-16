from quart import request


import time


def logging(log_file: str, session: str, session_id: str) -> None:
    """
    A function that logs requests to a file.
    
    :param log_file: The file to log to.
    :param session: The session of the request.
    :param session_id: The session ID of the request.
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
