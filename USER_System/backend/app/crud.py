from sqlmodel import Session, select
from app.models import User
from app.auth import hash_password, verify_password

def create_user(session: Session, user: User):
    existing_user = session.query(User).filter(User.email == user.email).first()
    if existing_user:
        return {
            "result": False,
            "message": "Email already registered"
        }
    
    user.password = hash_password(user.password)
    session.add(user)
    session.commit()
    session.refresh(user)
    
    return {
        "result": True,
        "message": "User created successfully"
    }

def authenticate_user(session: Session, email: str, password: str):
    user = session.exec(select(User).where(User.email == email)).first()
    if not user or not verify_password(password, user.password):
        return None
    return user
