from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv
import os

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL is None:
    raise ValueError("DATABASE_URL environment variable not set")

# 注意: SQLModel create_engine 目前不支援 asyncpg，需使用同步版本
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    from . import models
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
