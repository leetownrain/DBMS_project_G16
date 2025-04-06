# backend/app/main.py
from fastapi import FastAPI
from app.database import create_db_and_tables
from app.crawler.integrated_update import update_all_from_crawler

app = FastAPI()

@app.on_event("startup")
def on_startup():
    # 建立資料庫與資料表
    create_db_and_tables()
    # 執行爬蟲抓資料並將結果更新到資料庫
    update_all_from_crawler()

@app.get("/")
def read_root():
    return {"哈哈": "爬完了啦乞丐"}

@app.post("/update-all")
def update_all_endpoint():
    update_all_from_crawler()
    return {"message": "所有爬蟲資料已存入 CourseInfo 表中"}

