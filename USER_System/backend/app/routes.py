from fastapi import APIRouter, Depends, HTTPException,Query
from sqlmodel import Session
from app.database import get_session
from app.models import User
from app.crud import create_user, authenticate_user
from app.auth import create_access_token, decode_access_token

router = APIRouter()

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
        return {"result":True,"message": "Email exists in the database"}
    else:
        return {"result":False,"message": "Email is not in the database"}


@router.get("/verify_token/")
def verify_token(token: str = Query(...)):

    try:
        payload = decode_access_token(token)
        return {"result":True, "email": payload.get("sub"),"message": "Token is valid! "}
    except HTTPException as e:
        raise e
