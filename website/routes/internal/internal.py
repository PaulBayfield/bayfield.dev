from quart import send_from_directory, render_template, url_for, request, session

from ...components.blueprints import Bp
from ...components.respond import Respond

from ...utils.db import getUser


def init(app):
    blueprint = Bp(
        name='internal',
        import_name=__name__,
    )


    @blueprint.path(app, uri='/login', method=['GET','POST'], log_file="logging/website.log")
    async def login():
        """
        Login page.
        
        :return: The rendered template.
        """
        args = request.args
        if args.get("redirect", None):
            if args.get("redirect") == "home":
                redirect = url_for('portfolio.home')
            elif args.get("redirect") == "map":
                redirect = url_for('map.map')
            elif args.get("redirect") == "youtube":
                redirect = url_for('youtube.home')
            elif args.get("redirect") == "upload":
                redirect = url_for('upload.upload')
        else:
            redirect = url_for('portfolio.home')

        if session.get("username"):
            return Respond.redirect(redirect)

        error_fr = None
        error_en = None
        if request.method == 'POST':
            form_data = await request.form

            if form_data.get('username', None) and form_data.get('password', None):
                username = form_data.get('username')
                password = form_data.get('password')

                data = await getUser(app.pool, username, password)

                if not data:
                    error_fr = "Identifiants invalides. Veuillez réessayer."
                    error_en = "Invalid credentials. Please try again."

                    return Respond.render(await render_template('login.html', error_fr=error_fr, error_en=error_en))
                else:
                    session['username'] = username
                    session['admin'] = data["admin"]

                    return Respond.redirect(redirect)
            else:
                return Respond.redirect(url_for('internal.login'))
        else:
            return Respond.render(await render_template('login.html', error_fr=error_fr, error_en=error_en))
        

    @blueprint.path(app, uri='/logout', method=['GET','POST'], log_file="logging/website.log")
    async def logout():
        """
        Logout page.
        
        :return: The rendered template.
        """
        if session.get("username"):
            session.clear()

        return Respond.redirect(url_for('portfolio.home'))


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
    

    @blueprint.path(app, uri='/', method=['GET','POST'], subdomain="paul", log_file="logging/website.log")
    async def paul():
        """
        A function that redirects to LinkedIn.
        
        :return: A pong.
        """
        return Respond.redirect(redirect_url="https://linkedin.com/in/PaulBayfield")


    return blueprint
