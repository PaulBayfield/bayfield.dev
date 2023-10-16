import asyncpg
import psycopg


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


async def getVideo(pool: asyncpg.Pool, id: str) -> dict:
    """
    A function that returns a video from the database.
    
    :param pool: The connection Pool to the database.
    :param id: The id of the video.
    :return: The video from the database.
    """
    async with pool.acquire() as connection:
        connection: asyncpg.Connection
        result = await connection.fetchrow("SELECT * FROM videos WHERE id = $1", id)

    return dict(result) if result else None


async def insertVideo(pool: asyncpg.Pool, id: str, thumbnail: str, title: str, link: str, author: str, duration: int):
    """
    A function that inserts a video into the database. If the video with the same ID exists, it updates the record.
    
    :param pool: The connection Pool to the database.
    :param id: The id of the video.
    :param thumbnail: The thumbnail of the video.
    :param title: The title of the video.
    :param link: The link of the video.
    :param author: The author of the video.
    :param duration: The duration of the video.
    """
    async with pool.acquire() as connection:
        connection: asyncpg.Connection
        await connection.execute("""
            INSERT INTO videos (id, thumbnail, title, link, author, duration)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (id)
            DO UPDATE
            SET (thumbnail, title, link, author, duration) = ($2, $3, $4, $5, $6);
        """, id, thumbnail, title, link, author, duration)


async def getTask(pool: asyncpg.Pool, uuid: str) -> dict:
    """
    A function that returns a task from the database.
    
    :param pool: The connection Pool to the database.
    :param uuid: The uuid of the task.
    :return: The task from the database.
    """
    async with pool.acquire() as connection:
        connection: asyncpg.Connection
        result = await connection.fetchrow("SELECT * FROM downloads WHERE uuid = $1", uuid)

    return dict(result) if result else None


async def insertTask(pool: asyncpg.Pool, uuid: str, video: str, format: int, status: str, speed: str, downloaded: str, total: str, progress: int, eta: int):
    """
    A function that inserts a task into the database.
    
    :param pool: The connection Pool to the database.
    :param uuid: The uuid of the task.
    :param video: The video of the task.
    :param format: The format of the task.
    :param status: The status of the task.
    :param speed: The speed of the task.
    :param downloaded: The downloaded bytes of the task.
    :param total: The total bytes of the task.
    :param progress: The progress of the task.
    :param eta: The eta of the task.
    """
    format = await getFormatNumber(pool, format)

    async with pool.acquire() as connection:
        connection: asyncpg.Connection
        await connection.execute("INSERT INTO downloads VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)", uuid, video, format, status, speed, downloaded, total, progress, eta)


async def checkIfTaskExists(pool: asyncpg.Pool, uuid: str) -> bool:
    """
    A function that checks if a task exists in the database.
    
    :param pool: The connection Pool to the database.
    :param uuid: The uuid of the task.
    :return: True if the task exists, False otherwise.
    """
    return await getTask(pool, uuid) is not None


async def getFormatNumber(pool: asyncpg.Pool, format: str) -> int:
    """
    A function that returns the number of a format.
    
    :param pool: The connection Pool to the database.
    :param format: The format.
    :return: The number of the format.
    """
    async with pool.acquire() as connection:
        connection: asyncpg.Connection
        result = await connection.fetchrow("SELECT id FROM formats WHERE name = $1", format)
    
    return result['id']


async def getFormat(pool: asyncpg.Pool, id: int) -> str:
    """
    A function that returns the number of a format.
    
    :param pool: The connection Pool to the database.
    :param id: The id.
    :return: The name of the format.
    """
    async with pool.acquire() as connection:
        connection: asyncpg.Connection
        result = await connection.fetchrow("SELECT name FROM formats WHERE id = $1", id)

    return result['name']


async def updateProgress(pool: asyncpg.Pool, uuid: str, progress: int):
    """
    A function that updates the progress of a task.
    
    :param pool: The connection Pool to the database.
    :param uuid: The uuid of the task.
    :param progress: The progress of the task.
    """
    async with pool.acquire() as connection:
        connection: asyncpg.Connection
        await connection.execute("UPDATE downloads SET progress = $1 WHERE uuid = $2", progress, uuid)


async def updateTask(pool: asyncpg.Pool, uuid: str, status: str, speed: str, downloaded: str, total: str, progress: int, eta: int):
    """
    A function that updates a task.
    
    :param pool: The connection Pool to the database.
    :param uuid: The uuid of the task.
    :param status: The status of the task.
    :param speed: The speed of the task.
    :param downloaded: The downloaded bytes of the task.
    :param total: The total bytes of the task.
    :param progress: The progress of the task.
    :param eta: The eta of the task.
    """
    async with pool.acquire() as connection:
        connection: asyncpg.Connection
        await connection.execute("UPDATE downloads SET status = $1, speed = $2, downloaded = $3, total = $4, progress = $5, eta = $6 WHERE uuid = $7", status, speed, downloaded, total, progress, eta, uuid)


async def updateTaskStatus(pool: asyncpg.Pool, uuid: str, status: str, speed: str, progress: int, eta: int):
    """
    A function that updates a task.
    
    :param pool: The connection Pool to the database.
    :param uuid: The uuid of the task.
    :param status: The status of the task.
    :param speed: The speed of the task.
    :param progress: The progress of the task.
    :param eta: The eta of the task.
    """
    async with pool.acquire() as connection:
        connection: asyncpg.Connection
        await connection.execute("UPDATE downloads SET status = $1, speed = $2, progress = $3, eta = $4 WHERE uuid = $5", status, speed, progress, eta, uuid)


async def getVideoFromUUID(pool: asyncpg.Pool, uuid: str) -> str:
    """
    A function that returns the video from a task.
    
    :param pool: The connection Pool to the database.
    :param uuid: The uuid of the task.
    :return: The video of the task.
    """
    async with pool.acquire() as connection:
        connection: asyncpg.Connection
        result = await connection.fetchrow("""
            SELECT * 
            FROM videos
            JOIN downloads ON videos.id = downloads.video
            WHERE uuid = $1
        """, uuid)

    return dict(result) if result else None


async def getFileNameFromID(pool: asyncpg.Pool, id: str) -> str:
    """
    A function that returns the file name of a video.
    
    :param pool: The connection Pool to the database.
    :param id: The id of the video.
    :return: The file name of the video.
    """
    async with pool.acquire() as connection:
        connection: asyncpg.Connection
        result = await connection.fetchrow("SELECT title FROM videos WHERE id = $1", id)

    return result['title']


def slowUpdateTask(conn: psycopg.Connection, uuid: str, status: str, speed: str, downloaded: str, total: str, progress: int, eta: int):
    """
    A function that updates a task.
    
    :param pool: The connection Pool to the database.
    :param uuid: The uuid of the task.
    :param status: The status of the task.
    :param speed: The speed of the task.
    :param downloaded: The downloaded bytes of the task.
    :param total: The total bytes of the task.
    :param progress: The progress of the task.
    :param eta: The eta of the task.
    """
    conn.execute("UPDATE downloads SET status = %s, speed = %s, downloaded = %s, total = %s, progress = %s, eta = %s WHERE uuid = %s", (status, speed, downloaded, total, progress, eta, uuid))
