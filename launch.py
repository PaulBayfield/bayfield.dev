from gunicorn.app.wsgiapp import WSGIApplication


class StandaloneApplication(WSGIApplication):
    """
    A class that allows for running a Flask application with Gunicorn.
    (https://stackoverflow.com/a/73895674)

    => gunicorn -b 0.0.0.0:80 application:app
    
    :param app_uri: The URI of the Flask application.
    :param options: The options to pass to Gunicorn.
    """
    def __init__(self, app_uri, options=None):
        self.options = options or {}
        self.app_uri = app_uri
        super().__init__()


    def load_config(self):
        config = {
            key: value
            for key, value in self.options.items()
            if key in self.cfg.settings and value is not None
        }
        for key, value in config.items():
            self.cfg.set(key.lower(), value)


def run() -> None:
    """
    A function that runs the Flask application with Gunicorn.
    """
    options = {
        "bind": "0.0.0.0:80"
    }
    StandaloneApplication("website.main:app", options).run()

run()
