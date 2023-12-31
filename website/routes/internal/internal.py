from quart import send_from_directory, url_for

from ...components.blueprints import Bp
from ...components.respond import Respond


def init(app):
    blueprint = Bp(
        name='internal',
        import_name=__name__,
    )


    @blueprint.path(app, uri="/<path:path>", method=['GET','POST'], log_file="/logging/website.log")
    async def catch_all(path):
        return Respond.redirect(redirect_url=url_for('portfolio.home'))
    

    @blueprint.path(app, uri="/<path:path>", method=['GET','POST'], subdomain="saintthibault", log_file="/logging/website.log")
    async def catch_all_saintthibault(path):
        return Respond.redirect(redirect_url=url_for('portfolio.home'))


    @blueprint.path(app, uri="/<path:path>", method=['GET','POST'], subdomain="youtube", log_file="/logging/website.log")
    async def catch_all_youtube(path):
        return Respond.redirect(redirect_url=url_for('portfolio.home'))


    @blueprint.path(app, uri="/<path:path>", method=['GET','POST'], subdomain="map", log_file="/logging/website.log")
    async def catch_all_map(path):
        return Respond.redirect(redirect_url=url_for('portfolio.home'))


    @blueprint.path(app, uri='/favicon.ico', method=['GET','POST'], log_file="logging/website.log")
    async def home_favicon():
        """
        The favicon of the website.

        :return: The favicon.
        """
        return await send_from_directory(f"{app.path}/website/static", 'favicon.ico', mimetype='image/x-icon')


    @blueprint.path(app, uri='/favicon.ico', method=['GET','POST'], subdomain="saintthibault", log_file="logging/website.log")
    async def saintthibault_favicon():
        """
        The favicon of the website.

        :return: The favicon.
        """
        return await send_from_directory(f"{app.path}/website/static", 'favicon.ico', mimetype='image/x-icon')


    @blueprint.path(app, uri='/favicon.ico', method=['GET','POST'], subdomain="youtube", log_file="logging/website.log")
    async def youtube_favicon():
        """
        The favicon of the website.

        :return: The favicon.
        """
        return await send_from_directory(f"{app.path}/website/static", 'favicon.ico', mimetype='image/x-icon')
    

    @blueprint.path(app, uri='/favicon.ico', method=['GET','POST'], subdomain="map", log_file="logging/website.log")
    async def map_favicon():
        """
        The favicon of the website.

        :return: The favicon.
        """
        return await send_from_directory(f"{app.path}/website/static", 'favicon.ico', mimetype='image/x-icon')


    @blueprint.path(app, uri='/favicon.ico', method=['GET','POST'], subdomain="media", log_file="logging/website.log")
    async def media_favicon():
        """
        The favicon of the website.

        :return: The favicon.
        """
        return await send_from_directory(f"{app.path}/website/static", 'favicon.ico', mimetype='image/x-icon')


    @blueprint.path(app, uri='/ping', method=['GET','POST'], log_file="logging/website.log")
    async def ping():
        """
        A function that returns a pong.
        
        :return: A pong.
        """
        return Respond.json(data={"ping": "pong"})


    return blueprint
