from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import create_db_and_tables, get_session  # 导入 get_session
from app.routes import router
from app.auth import authenticate_user, create_access_token  # 假设你有一个用于身份验证和 JWT 的模块

app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_and_tables() 

@app.get("/")
def read_root():
    return {"message": "Welcome to FastAPI + SQLModel + PostgreSQL!"}

@router.post("/login/")
def login(email: str, password: str, session: Session = Depends(get_session)):
    user = authenticate_user(session, email, password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token({"sub": user.email})
    
    print("Generated Token:", access_token)
    


app.include_router(router)
