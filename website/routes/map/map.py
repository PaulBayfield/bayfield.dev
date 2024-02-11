from quart import render_template, request, session

from ...components.blueprints import Bp
from ...components.respond import Respond

from ...utils.environ import getEnvironKey


from json import loads, dumps


def init(app):
    blueprint = Bp(
        name='map',
        import_name=__name__,
        template_folder='templates',
        static_folder='static',
        static_url_path='/static/map/'
    )

    TYPES = [
        "monument",
        "maison",
        "musee",
        "zoo",
        "parc",
        "ville",
        "gite",
        "restaurant",
    ]

    def getBoolean(val: bool) -> str:
        """
        Return a boolean from a string.
        
        :param val: The string to convert.
        :return: The boolean.
        """
        if val:
            return "true"
        else:
            return "false"


    """
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    ┃                                                                                                                      ┃
    ┃                                                    - Map Routes -                                                    ┃
    ┃                                                                                                                      ┃
    ┃                                                                                                                      ┃
    ┃  • map.bayfield.dev                                                                                                  ┃
    ┃    > Places I've visited                                                                                             ┃
    ┃  • map.bayfield.dev/add                                                                                              ┃
    ┃    > (Backend) Add a marker                                                                                          ┃
    ┃                                                                                                                      ┃
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    """


    @blueprint.path(app, uri='/', method=['GET','POST'], subdomain="map", log_file="logging/website.log")
    async def map():
        """
        The home page of the website.
        
        :return: The rendered template.
        """
        if session.get("username") and session.get("admin"):
            authentified = True
        else:
            authentified = False

        with open(f"data.json", "r+", encoding="utf-8") as f:
            markers_data: list = loads(f.read())

        markers = []
        for marker in markers_data:
            if marker["type"] in ['maison', 'gite', 'restaurant'] and not authentified:
                continue

            markers.append(marker)

        last = {
            "lat": 48.856614,
            "lon": 2.3522219,
            "description": "Paris",
            "type": "ville",
        }

        return Respond.html(await render_template("map.html", markers=markers, last=last, edit=getBoolean(session.get("admin", False)), API_KEY=getEnvironKey("GOOGLE_API_KEY")))


    @blueprint.path(app, uri='/add', method=['POST'], subdomain="map", log_file="logging/website.log")
    async def add():
        """
        Add a marker to the map.
        
        :return: OK
        """
        if not session.get("username") or not session.get("admin"):
            return Respond.html("Vous n'êtes pas autorisé à effectuer cette action.", status_code=403)

        with open(f"data.json", "r+", encoding="utf-8") as f:
            data: list = loads(f.read())

        form_data = await request.form

        if form_data["type"].lower() in TYPES:
            data.append(
                {
                    "lat": form_data["lat"],
                    "lon": form_data["lng"],
                    "description": form_data["description"],
                    "type": form_data["type"].lower(),
                }
            )

            with open(f"data.json", "w+", encoding="utf-8") as f:
                f.write(dumps(data, indent=4))

            return Respond.json({"status": "OK"})
        else:
            return Respond.html(f"Le type \"{form_data['type'].lower()}\" n'existe pas.", status_code=400)


    return blueprint
