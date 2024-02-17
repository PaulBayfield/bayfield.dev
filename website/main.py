from quart import session

from .utils.environ import getEnvironKey

from .components.website import Website

from .routes import *
from .routes.youtube.utils.tasks import Tasks
from .routes.youtube.utils.schedule import Schedule


import os

from pathlib import Path
from uuid import uuid4
from asyncpg import create_pool


# Create the directories for the logging and the downloads.
if not os.path.exists(f"{str(Path(__file__).parent.parent)}/logging"):
    os.makedirs(f"{str(Path(__file__).parent.parent)}/logging")

if not os.path.exists(f"{str(Path(__file__).parent.parent)}/{getEnvironKey('DOWNLOAD_PATH')}"):
    os.makedirs(f"{str(Path(__file__).parent.parent)}/{getEnvironKey('DOWNLOAD_PATH')}")


app = Website(__name__)

# App settings
app.config['SERVER_NAME'] = getEnvironKey('DOMAIN_NAME')
app.config['SECRET_KEY'] = getEnvironKey('FLASK_SECRET_KEY', str(uuid4()))
app.config['SESSION_COOKIE_DOMAIN'] = getEnvironKey('SESSION_COOKIE_DOMAIN')
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024 # 100 MB limit
app.config['EXPLAIN_TEMPLATE_LOADING'] = False


# Register blueprints
app.register_blueprint(Route_Internal(app))
app.register_blueprint(Route_Map(app))
app.register_blueprint(Route_Media(app))
app.register_blueprint(Route_Miscellaneous(app))
app.register_blueprint(Route_PDF(app))
app.register_blueprint(Route_Portfolio(app))
app.register_blueprint(Route_SaintThibault(app))
app.register_blueprint(Route_YouTube(app))


# Create the instance for the Schedule.
app.sch = Schedule(
    directory=f"{os.getcwd()}{getEnvironKey('DOWNLOAD_PATH')}",
    maxSave=int(getEnvironKey('MAX_SAVE'))
)


@app.while_serving
async def lifespan():
    app.path = Path(__file__).parent.parent
    app.tasks = Tasks(app)

    app.pool = await create_pool(
        database=getEnvironKey('POSTGRES_DATABASE'),
        user=getEnvironKey('POSTGRES_USER'),
        password=getEnvironKey('POSTGRES_PASSWORD'),
        host=getEnvironKey('POSTGRES_HOST'),
        port=getEnvironKey('POSTGRES_PORT')
    )

    with open(f"{app.path}/logging/website.log", 'a+') as f:
        f.write(f"Server started!\n")

    yield

    await app.pool.close()

    with open(f"{app.path}/logging/website.log", 'a+') as f:
        f.write(f"Server stopping...\n")


@app.before_request
def make_session_permanent():
    session.permanent = True
