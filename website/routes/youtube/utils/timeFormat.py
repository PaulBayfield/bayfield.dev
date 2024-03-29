def format_seconds(seconds: int) -> str:
    """
    Formats seconds into a human readable string
    
    :param seconds: The number of seconds to format
    :return: A human readable string
    """
    days, remainder = divmod(seconds, 86400)
    hours, remainder = divmod(remainder, 3600)
    minutes, seconds = divmod(remainder, 60)

    if days > 0:
        return f"{days} days"
    elif hours > 0:
        return f"{hours} hours"
    elif minutes > 0:
        return f"{minutes} minutes"
    else:
        return f"{seconds} seconds"
