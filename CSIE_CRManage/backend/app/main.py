# backend/app/main.py
from fastapi import FastAPI
from app.database import create_db_and_tables
from app.crawler.update_course_info import update_all_from_crawler
from app.crawler.update_course_time import update_course_time_from_crawler

app = FastAPI()

@app.on_event("startup")
def on_startup():
    # 建立資料庫與資料表（依 models/__init__.py 決定建立哪些表）
    create_db_and_tables()

@app.get("/")
def read_root():
    return {"message": "系統運作中"}

@app.post("/crawler/update")
def update_all_endpoint():
    """
    手動觸發爬蟲抓取，更新 CourseInfo 與 CourseTime 表的資料。
    """
    update_all_from_crawler()
    update_course_time_from_crawler()
    return {"message": "所有爬蟲資料已更新到 CourseInfo 與 CourseTime 表中"}
