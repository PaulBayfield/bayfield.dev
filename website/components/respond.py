from quart import Response, send_file, redirect


import os

from json import dumps


class Respond:
    @staticmethod
    def json(data: dict | list | tuple | str | int | float | bool | None, status_code: int = 200) -> Response:
        """
        :param data: data to send as json
        :param status_code: status code of the response
        :return: Response object
        """
        return Response(response=dumps(data).encode("utf-8"), status=status_code, mimetype='application/json')


    @staticmethod
    def text(text: str, status_code: int = 200) -> Response:
        """
        :param text: text to send
        :param status_code: status code of the response
        :return: Response object
        """
        return Response(response=text, status=status_code, mimetype="text/plain")


    @staticmethod
    def render(html: str, status_code: int = 200) -> Response:
        """
        :param html: html to send
        :param status_code: status code of the response
        :return: Response object
        """
        return Response(response=html, status=status_code, mimetype="text/html")


    @staticmethod
    async def file(path_or_file: str, attachment: bool = False, mimetype: str = None, attachment_filename: str = None) -> send_file:
        """
        :param path_or_file: file to send
        :param attachment: send as an attachment
        :param mimetype: mimetype of response
        :return: send_file object
        """
        return await send_file(path_or_file, mimetype=mimetype, as_attachment=attachment, attachment_filename=attachment_filename)


    @staticmethod
    async def image(path_or_file: str, attachment: bool = False, attachment_filename: str = None) -> send_file:
        """
        :param path_or_file: file to send
        :param attachment: send as an attachment
        :return: send_file object
        """
        return await send_file(path_or_file, mimetype='image/png', as_attachment=attachment, attachment_filename=attachment_filename)


    @staticmethod
    def redirect(redirect_url: str) -> redirect:
        """
        :param redirect_url: url to redirect user to
        :return: redirect response object
        """
        return redirect(redirect_url, code=302)


    @staticmethod
    def malformed(malformed_item) -> Response:
        """
        :param malformed_item: input field that is malformed
        :return: Response object
        """
        return Response(response=dumps({"success": False, "cause": f"Malformed [{malformed_item}]"}).encode("utf-8"), status=422, mimetype='application/json')


    @staticmethod
    def missing(missing_field: str | list) -> Response:
        """
        :param missing_field: required input field that has not been provided
        :return: Response object
        """
        missing_field = [missing_field] if type(missing_field) is str else missing_field
        return Response(response=dumps({"success": False, "cause": f"Missing one or more fields [{' / '.join(missing_field)}]"}).encode("utf-8"), status=400, mimetype='application/json')


    @staticmethod
    def error(cause: str) -> Response:
        """
        :param cause: details of the error
        :return: Response object
        """
        return Response(response=dumps({"success": False, "cause": cause}).encode("utf-8"), status=500, mimetype='application/json')


    @staticmethod
    def forbidden(cause: str) -> Response:
        """
        :param cause: why access has been denied
        :return: Response object
        """
        return Response(response=dumps({"success": False, "cause": f"{cause}"}).encode("utf-8"), status=403, mimetype='application/json')


    @staticmethod
    def method_not_allowed() -> Response:
        """
        :return: Response object
        """
        return Response(response=dumps({"success": False, "cause": f"Method not allowed."}).encode("utf-8"), status=405, mimetype='application/json')


    @staticmethod
    def server_error() -> Response:
        """
        :return: Response object
        """
        return Response(response=dumps({"success": False, "cause": "Server Error"}).encode("utf-8"), status=500, mimetype='application/json')


    @staticmethod
    def deprecated() -> Response:
        """
        :return: Response object
        """
        return Response(response=dumps({"success": False, "cause": "Deprecated"}).encode("utf-8"), status=410, mimetype='application/json')


    @staticmethod
    def backend_down() -> Response:
        """
        :return: Response object
        """
        return Response(response=dumps({"success": False, "cause": "Backend Connection Failed"}).encode("utf-8"), status=503, mimetype='application/json')


    @staticmethod
    def body_too_big(cause: str) -> Response:
        """
        :return: Response object
        """
        return Response(response=dumps({"success": False, "cause": cause}).encode("utf-8"), status=403, mimetype='application/json')


    @staticmethod
    def rate_limited(wait_time=None, ip: bool = False, key: bool = False, gbl: bool = False, limit: int = 0) -> Response:
        """
        :param wait_time: time to wait until access will be allowed
        :return: Response object
        """
        if wait_time is None:
            return Response(response=dumps({"success": False, "cause": f"Rate Limited", "ip": ip, "key": key, "global": gbl, "limit": limit}).encode("utf-8"), status=429, mimetype='application/json')
        else:
            return Response(response=dumps({"success": False, "cause": f"Rate Limited - Try again in {wait_time} seconds.", "ip": ip, "key": key, "global": gbl, "limit": limit}).encode("utf-8"), status=429, mimetype='application/json', headers={"Retry-After": wait_time})


    @staticmethod
    def service_unavailable(wait_time: int) -> Response:
        """
        :param wait_time: time to wait until resource is ready
        :return: Response object
        """
        return Response(response=dumps({"success": False, "cause": "Resource generating try again in a few seconds"}).encode("utf-8"), status=503, mimetype='application/json', headers={"Retry-After": wait_time})


    @staticmethod
    def exceeded_limits(item: str, limit: int) -> Response:
        """
        :param item: Item supplied in the request e.g. scores to be submitted
        :param limit: Max number of items allowed to be supplied e.g. max 10 scores per request
        :return: Response object
        """
        return Response(response=dumps({"success": False, "cause": f"Max {limit} {item} allowed per request"}).encode("utf-8"), status=404, mimetype='application/json')


    @staticmethod
    def invalid(key: str, data: dict | list | tuple | str | int | float | bool | None = None, success: bool = True, status_code: int = 404) -> Response:
        """
        :param key: Item that was not considered valid e.g. player not in database
        :param data: Data to be returned (most likely None)
        :param success: Was the requests successful despite lack of data to return?
        :param status_code: Status code to return (most likely 404)
        :return: Response object
        """
        return Response(response=dumps({"success": success, f"{key}": data}).encode("utf-8"), status=status_code, mimetype='application/json')


    @staticmethod
    def event_stream(data: str, status_code: int = 200) -> Response:
        """
        :param data: data to send
        :param status_code: status code of the response
        :return: Response object
        """
        rep = Response(response=data, status=status_code, mimetype='text/event-stream', headers={'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive'})
        rep.timeout = None
        return rep


    @staticmethod
    def stream(path: str, name: str, mimetype: str, status_code: int = 200) -> Response:
        """
        :param data: data to send
        :param mimetype: mimetype of the response
        :param status_code: status code of the response
        :return: Response object
        """
        def generate():
            with open(path, 'rb') as file:
                while True:
                    chunk = file.read(1024 * 1024)  # 1 MB chunks
                    if not chunk:
                        break
    
                    yield chunk

        return Response(generate(), status=status_code, mimetype=mimetype, headers={'Content-Disposition': f'attachment; filename="{name}"', 'Content-Length': str(os.path.getsize(path))}, content_type=mimetype)
