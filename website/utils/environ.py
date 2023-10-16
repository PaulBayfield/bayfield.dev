from os import environ
from dotenv import load_dotenv


load_dotenv(dotenv_path=f".env")


def getEnvironKey(key: str, default: str = None):
    """
    Get an environment variable.

    :param key: The key to get the environment variable from
    :param default: The default value to return if the environment variable is not set
    :return: The value of the environment variable
    """
    ev = environ.get(key)
    if ev == "false":
        return False
    elif ev == "true":
        return True
    elif ev == "" or ev == "none":
        return default
    else:
        return ev
