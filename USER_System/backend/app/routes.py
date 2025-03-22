from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models import User
from app.crud import create_user, authenticate_user
from app.auth import create_access_token, get_current_user

router = APIRouter()

# 註冊 API
@router.post("/users/")
def create_new_user(user: User, session: Session = Depends(get_session)):
    return create_user(session, user)

# 登入 API (產生 JWT)
@router.post("/login/")
def login(email: str, password: str, session: Session = Depends(get_session)):
    user = authenticate_user(session, email, password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token({"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# 受保護的路由，只有有效的 JWT token 用戶可以訪問
@router.get("/protected/")
def protected_route(user: dict = Depends(get_current_user)):
    return {"message": "You have access to this protected route!", "user": user}
