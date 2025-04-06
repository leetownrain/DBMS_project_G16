import os
from dotenv import load_dotenv

load_dotenv()

User_APIs = "http://127.0.0.1:7000"

class User_APIs:
    POST_LOGIN = f"{User_APIs}/login/"
    POST_CREATE_USER = f"{User_APIs}/users/"
    GET_CHECK_EMAIL = f"{User_APIs}/check_email/"
    GET_VERIFY_TOKEN = f"{User_APIs}/verify_token/"