from typing import Union

from fastapi import FastAPI, Depends
from sqlmodel import Session, select

from .database import create_db_and_tables, get_session

from app.crawler.integrated_update import update_all_from_crawler

app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

     # 執行爬蟲抓資料並將結果更新到資料庫
    update_all_from_crawler()

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.post("/update-all")
def update_all_endpoint():
    update_all_from_crawler()
    return {"message": "所有爬蟲資料已存入 CourseInfo 表中"}