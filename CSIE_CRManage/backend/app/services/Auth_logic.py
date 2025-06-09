from sqlmodel import Session, select
from fastapi import HTTPException

from app.models import User, RoleEnum
from app.services.http_logic import get_request

def create_user_in_db(session: Session, email: str) -> User:
    # 以 email 的 @ 前綴作為 username，如果沒有 @ 就預設為 "user"
    username = email.split("@")[0] if "@" in email else "user"
    # 建立新使用者，role 固定為 user
    new_user = User(email=email, username=username, role=RoleEnum.user, is_psd_init=False)
    
    # 選擇性：檢查該 email 是否已存在資料庫中
    statement = select(User).where(User.email == email)
    existing_user = session.exec(statement).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists in local DB.")
    
    session.add(new_user)
    session.commit()
    # session.refresh(new_user)
    return new_user

def get_user_role(session: Session, email: str) -> str:
    """根據 email 查詢使用者的角色，若找不到使用者則拋出 404 錯誤"""
    statement = select(User).where(User.email == email)
    user = session.exec(statement).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.role


def get_user_is_psd_init(session: Session, email: str) -> bool:
    """根據 email 查詢使用者，並回傳 is_psd_init 的值，如果找不到則拋出 HTTPException"""
    statement = select(User).where(User.email == email)
    user = session.exec(statement).first()
    print("查詢結果：", user)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.is_psd_init

def get_user_name(session: Session, email: str) -> str:
    """根據 email 查詢使用者名稱 username，若找不到則拋出 HTTPException"""
    statement = select(User).where(User.email == email)
    user = session.exec(statement).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.username
