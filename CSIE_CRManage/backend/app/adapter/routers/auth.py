from fastapi import APIRouter, HTTPException
from sqlmodel import SQLModel

import httpx
from app.urls import User_APIs

auth_router = APIRouter(prefix="/auth", tags=["auth"])

class loginCommand(SQLModel):
    email: str
    password: str

@auth_router.post("/login")
async def login(user_info: loginCommand):
    async with httpx.AsyncClient() as client:
        response = await client.get(User_APIs.CHECK_EMAIL, params={"email": user_info.email})
        
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="External API error")
    
    data = response.json()
    print(data)
    return {"message": "Login endpoint"}