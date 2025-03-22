from fastapi import FastAPI
from app.database import create_db_and_tables
from app.routes import router

app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()  # 這行會自動創建資料表

@app.get("/")
def read_root():
    return {"message": "Welcome to FastAPI + SQLModel + PostgreSQL!"}

app.include_router(router)
