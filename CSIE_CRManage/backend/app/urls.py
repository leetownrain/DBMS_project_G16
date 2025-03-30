import os
from dotenv import load_dotenv

load_dotenv()

User_APIs = "http://localhost:8000"

class User_APIs:
    login = f"{User_APIs}/login"
    CHECK_EMAIL = f"{User_APIs}/check_email/"