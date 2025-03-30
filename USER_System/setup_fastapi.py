import os

# 設定專案目錄
project_name = "backend"
base_dir = os.path.join(os.getcwd(), project_name)

# 定義專案結構
folders = ["app"]
files = {
    "app/main.py": '''from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to FastAPI + SQLModel + PostgreSQL!"}
''',
    "app/database.py": '''from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv
import os

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
''',
    "app/models.py": '''from sqlmodel import SQLModel, Field
from typing import Optional

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str
''',
    "app/crud.py": '''from sqlmodel import Session, select
from app.models import User

def create_user(session: Session, user: User):
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

def get_users(session: Session):
    return session.exec(select(User)).all()
''',
    "app/routes.py": '''from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.database import get_session
from app.models import User
from app.crud import create_user, get_users

router = APIRouter()

@router.post("/users/")
def create_new_user(user: User, session: Session = Depends(get_session)):
    return create_user(session, user)

@router.get("/users/")
def read_users(session: Session = Depends(get_session)):
    return get_users(session)
''',
    "app/config.py": '''import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
''',
    ".env": "DATABASE_URL=postgresql://username:password@localhost:5432/yourdatabase\n",
    "requirements.txt": "fastapi\nuvicorn\nsqlmodel\npsycopg2-binary\ndotenv\n"
}

# 建立資料夾
for folder in folders:
    os.makedirs(os.path.join(base_dir, folder), exist_ok=True)

# 建立檔案並寫入內容
for file_path, content in files.items():
    file_full_path = os.path.join(base_dir, file_path)
    with open(file_full_path, "w", encoding="utf-8") as f:
        f.write(content)

print(f"🎉 FastAPI 專案 '{project_name}' 建立完成！")
