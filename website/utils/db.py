import asyncpg


async def getUser(pool: asyncpg.Pool, username: str, password: str) -> dict:
    """
    A function that returns a user from the database.
    
    :param pool: The connection Pool to the database.
    :param username: The username of the user.
    :param password: The password of the user.
    :return: The user from the database.
    """
    async with pool.acquire() as connection:
        connection: asyncpg.Connection
        result = await connection.fetchrow("SELECT * FROM users WHERE username = $1 AND password = $2", username, password)

    return dict(result) if result else None
