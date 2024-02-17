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
    ┃  • interets.bayfield.dev                                                                                             ┃
    ┃    > Calculates the interest on a given amount of money. (Uni project)                                               ┃
    ┃                                                                                                                      ┃
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    """


    @blueprint.path(app, uri='/', method=['GET','POST'], subdomain="interets", log_file="logging/website.log")
    async def interets():
        """
        Interest calculator.
        
        :return: The rendered template.
        """
        return Respond.html(await render_template('interets.html'))


    return blueprint
