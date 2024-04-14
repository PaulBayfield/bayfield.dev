from quart import render_template

from ...components.blueprints import Bp
from ...components.respond import Respond


def init(app):
    blueprint = Bp(
        name='saintthibault',
        import_name=__name__,
        template_folder='templates',
        static_folder='static',
        static_url_path='/static/saintthibault/'
    )


    """
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    ┃                                                                                                                      ┃
    ┃                                              - Saint Thibault Routes -                                               ┃
    ┃                                                                                                                      ┃
    ┃                                                                                                                      ┃
    ┃  • saintthibault.bayfield.dev                                                                                        ┃
    ┃    > Home page of the Saint Thibault website.                                                                        ┃
    ┃                                                                                                                      ┃
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    """

    @blueprint.path(app, uri='/', method=['GET','POST'], subdomain="saintthibault", log_file="logging/website.log")
    async def saintthibault():
        """
        The home page of the Saint Thibault website.
        
        :return: The rendered template.
        """
        return Respond.render(await render_template('saintthibault.html'))


    return blueprint
