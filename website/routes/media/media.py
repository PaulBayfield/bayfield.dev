from quart import send_file

from ...components.blueprints import Bp
from ...components.respond import Respond


import os


def init(app):
    blueprint = Bp(
        name='media',
        import_name=__name__,
        template_folder='templates',
        static_folder='static',
    )


    """
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    ┃                                                                                                                      ┃
    ┃                                                  - Media Routes -                                                    ┃
    ┃                                                                                                                      ┃
    ┃                                                                                                                      ┃
    ┃  • media.bayfield.dev                                                                                                ┃
    ┃    > Shared medias                                                                                                   ┃
    ┃                                                                                                                      ┃
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    """


    @blueprint.path(app, uri='/<path:filename>', method=['GET','POST'], subdomain="media", log_file="logging/website.log")
    async def media(filename):
        """
        A media file.

        :param filename: The name of the file.
        :return: The file.
        """
        if not os.path.exists(f"{app.path}/media/{filename}"):
            return Respond.invalid(key="cause", data=f"File {filename} not found!", success=False)
        else:
            return await send_file(f"{app.path}/media/{filename}")
            

    return blueprint
