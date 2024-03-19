from quart import render_template, url_for

from ...components.blueprints import Bp
from ...components.respond import Respond


def init(app):
    blueprint = Bp(
        name='miscellaneous',
        import_name=__name__,
        template_folder='templates',
        static_folder='static',
        static_url_path='/static/miscellaneous/'
    )


    """
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    ┃                                                                                                                      ┃
    ┃                                               - Miscellaneous Routes -                                               ┃
    ┃                                                                                                                      ┃
    ┃                                                                                                                      ┃
    ┃  • compta.bayfield.dev/                                                                                              ┃
    ┃    > Home page.                                                                                                      ┃
    ┃  • compta.bayfield.dev/interets                                                                                      ┃
    ┃    > Calculates the interest on a given amount of money. (Uni project)                                               ┃
    ┃  • compta.bayfield.dev/emprunt                                                                                       ┃
    ┃    > Calculates the monthly payments on a loan. (Uni project)                                                        ┃
    ┃                                                                                                                      ┃
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    """


    @blueprint.path(app, uri='/', method=['GET','POST'], subdomain="compta", log_file="logging/website.log")
    async def compta_home():
        """
        Home page
        
        :return: The rendered template.
        """
        return Respond.html(await render_template('home.html'))


    @blueprint.path(app, uri='/interets', method=['GET','POST'], subdomain="compta", log_file="logging/website.log")
    async def interets():
        """
        Interest calculator.
        
        :return: The rendered template.
        """
        return Respond.html(await render_template('interets.html'))
    

    @blueprint.path(app, uri='/emprunt', method=['GET','POST'], subdomain="compta", log_file="logging/website.log")
    async def emprunt():
        """
        Emprunt calculator.
        
        :return: The rendered template.
        """
        return Respond.html(await render_template('emprunt.html'))


    return blueprint
