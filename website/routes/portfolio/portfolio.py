from quart import render_template, url_for

from ...components.blueprints import Bp
from ...components.respond import Respond


def init(app):
    blueprint = Bp(
        name='portfolio',
        import_name=__name__,
        template_folder='templates',
        static_folder='static',
        static_url_path='/static/portfolio/'
    )


    """
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    ┃                                                                                                                      ┃
    ┃                                                 - Portfolio Routes -                                                 ┃
    ┃                                                                                                                      ┃
    ┃                                                                                                                      ┃
    ┃  • bayfield.dev                                                                                                      ┃
    ┃    > Home page                                                                                                       ┃
    ┃  • www.bayfield.dev                                                                                                  ┃
    ┃    > Redirects to bayfield.dev                                                                                       ┃
    ┃  • cv.bayfield.dev                                                                                                   ┃
    ┃    > Shows my Curriculum Vitae                                                                                       ┃
    ┃                                                                                                                      ┃
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    """


    @blueprint.path(app, uri='/', method=['GET','POST'], log_file="logging/website.log")
    async def home():
        """
        The home page of the website.
        
        :return: The rendered template.
        """
        return Respond.render(await render_template('index.html'))


    @blueprint.path(app, uri='/', method=['GET','POST'], subdomain="www", log_file="logging/website.log")
    async def www():
        """
        Redirects to the home page.
        
        :return: The redirect.
        """
        return Respond.redirect(url_for('portfolio.home'))


    @blueprint.path(app, uri='/', method=['GET','POST'], subdomain="cv", log_file="logging/website.log")
    async def cv():
        """
        Redirects to the home page.
        
        :return: The redirect.
        """
        return await Respond.file(path_or_file=f"{app.path}/website/static/CV_PAUL_BAYFIELD.pdf", attachment=False, mimetype="application/pdf", attachment_filename="CV_PAUL_BAYFIELD.pdf")


    return blueprint
