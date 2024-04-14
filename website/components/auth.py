class Auth:
    USER = 1
    ADMIN = 99


    @staticmethod
    def checkIfUser(session: dict):
        """
        Check if the user is logged in.
        
        :return: The user's username.
        """
        if not session.get("username"):
            return False
        else:
            return True


    @staticmethod
    def checkIfAdmin(session):
        """
        Check if the user is an admin.
        
        :return: The user's username.
        """
        if not session.get("username") or not session.get("admin"):
            return False
        else:
            return True


USER = Auth.USER
ADMIN = Auth.ADMIN
