from quart import render_template, send_from_directory

from ...components.blueprints import Bp
from ...components.respond import Respond


def init(app):
    blueprint = Bp(
        name='vangogh',
        import_name=__name__,
        template_folder='templates',
        static_folder='static',
        static_url_path='/static/vangogh/'
    )


    """
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    ┃                                                                                                                      ┃
    ┃                                                 - Van Gogh Routes -                                                  ┃
    ┃                                                                                                                      ┃
    ┃                                                                                                                      ┃
    ┃  • vangogh.bayfield.dev                                                                                              ┃
    ┃    > Home page                                                                                                       ┃
    ┃                                                                                                                      ┃
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    """


    @blueprint.path(app, uri='/', method=['GET','POST'], subdomain="vangogh", log_file="logging/website.log")
    async def vangogh_home():
        """
        The home page of the vangogh website.
        
        :return: The rendered template.
        """
        return Respond.render(await render_template('index.html'))


    @blueprint.path(app, uri='/favicon.ico', method=['GET','POST'], subdomain="vangogh", log_file="logging/website.log")
    async def vangogh_favicon():
        """
        The favicon of the vangogh website.
        
        :return: The rendered template.
        """
        return await send_from_directory(f"{app.path}/website/routes/vangogh/static/vangogh", 'favicon.ico', mimetype='image/x-icon')


    return blueprint
