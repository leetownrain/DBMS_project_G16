from fastapi import APIRouter, Depends, HTTPException, Query, Body
from sqlmodel import Session
from app.database import get_session
from app.models import User
from app.crud import create_user, authenticate_user
from app.auth import create_access_token, decode_access_token, hash_password
from pydantic import BaseModel

router = APIRouter()

# 定義 Request body 的 Pydantic 模型
class PasswordUpdate(BaseModel):
    password: str

class NameUpdate(BaseModel):
    name: str

@router.post("/users/")
def create_new_user(user: User, session: Session = Depends(get_session)):
    existing_user = session.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail={"message": "Email already registered"})
    return create_user(session, user)

@router.post("/login/")
def login(email: str, password: str, session: Session = Depends(get_session)):
    user = authenticate_user(session, email, password)
    if not user:
        raise HTTPException(status_code=401, detail={"message": "Invalid email or password"})
    
    access_token = create_access_token({"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/check_email/")
def check_email(email: str, session: Session = Depends(get_session)):
    user = session.query(User).filter(User.email == email).first()
    if user:
        return {"result": True, "message": "Email exists in the database"}
    else:
        return {"result": False, "message": "Email is not in the database"}

@router.get("/verify_token/")
def verify_token(token: str = Query(...)):
    try:
        payload = decode_access_token(token)
        return {"result": True, "email": payload.get("sub"), "message": "Token is valid! "}
    except HTTPException as e:
        raise e

@router.put("/change_password/")
def change_password(
    password_update: PasswordUpdate = Body(...),  # 使用 Pydantic 模型
    token: str = Query(...),
    session: Session = Depends(get_session)
):
    try:
        payload = decode_access_token(token)
        email = payload.get("sub")
        user = session.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail={"message": "User not found"})
        
        user.password = hash_password(password_update.password)  # 從 password_update.password 取得新密碼
        session.add(user)
        session.commit()
        session.refresh(user)

        return {"result": True, "message": "Password updated successfully!"}
    except HTTPException as e:
        raise e

@router.put("/change_name/")
def change_name(
    name_update: NameUpdate = Body(...),  # 使用 Pydantic 模型
    token: str = Query(...),
    session: Session = Depends(get_session)
):
    try:
        payload = decode_access_token(token)
        email = payload.get("sub")
        user = session.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail={"message": "User not found"})
        
        user.name = name_update.name  # 從 name_update.name 取得新名字
        session.add(user)
        session.commit()
        session.refresh(user)

        return {"result": True, "message": "Name updated successfully!"}
    except HTTPException as e:
        raise e