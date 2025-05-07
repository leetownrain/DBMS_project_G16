# DBMS_project_G16

# 教室借用系統（G16）
針對虎尾科技大學 資訊工程系

本專案包含：
- **身份驗證系統（Auth Service）**：獨立的使用者登入、註冊、驗證系統。
- **教室借用系統（Classroom Booking System）**：用於申請與管理教室借用，透過 Auth Service 進行身份驗證。

## 🚀 技術選擇

- **後端框架**：FastAPI
- **資料庫**：PostgreSQL
- **ORM**：SQLModel
- **身份驗證**：JWT (`fastapi-users` / `PyJWT`)
- **前端**：React

---

## 📌 1. 環境設定

### **安裝必要套件**
請確保已安裝 `Python 3.10+`，並安裝必要的依賴：
```bash
pip install fastapi uvicorn sqlmodel asyncpg psycopg2 fastapi-users passlib bcrypt requests jwt
```

* 吳哲瑋 41143213 四資工三乙
* 李鎮宇 41143216 四資工三乙
* 林致均 41143222 四資工三乙
* 陳亮祐 41143235 四資工三乙

# 作業一
* https://www.canva.com/design/DAGj9WScB2c/AUaKssZWl7kdMSSYxcPwuw/edit?utm_content=DAGj9WScB2c&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton
# 作業二
* https://www.canva.com/design/DAGmr2V3CzA/0mnUy8ykieZKFDUyV-0oBQ/edit?utm_content=DAGmr2V3CzA&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton
