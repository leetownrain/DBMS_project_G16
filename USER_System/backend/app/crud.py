from sqlmodel import Session, select
from app.models import User
from app.auth import hash_password, verify_password

def create_user(session: Session, user: User):
    user.password = hash_password(user.password)  # 加密密碼
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

def authenticate_user(session: Session, email: str, password: str):
    user = session.exec(select(User).where(User.email == email)).first()
    if not user or not verify_password(password, user.password):
        return None
    return user
