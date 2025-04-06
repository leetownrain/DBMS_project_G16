from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import SQLModel, Session

from app.database import get_session

from app.urls import User_APIs

from app.services.http_logic import get_request, post_request
from app.services.Auth_logic import create_user_in_db, get_user_role,get_user_is_psd_init

auth_router = APIRouter(prefix="/auth", tags=["auth"])

class loginCommand(SQLModel):
    email: str
    password: str

@auth_router.post("/login")
async def login(user_info: loginCommand, session: Session = Depends(get_session)):
    check_email_response = await get_request(User_APIs.GET_CHECK_EMAIL, params={"email": user_info.email})
    if check_email_response.status_code != 200:
        raise HTTPException(status_code=check_email_response.status_code, detail="External API error.(check email)")
    
    check_email_result = check_email_response.json()
    if check_email_result['result']:
        try:
            user_role = get_user_role(session, user_info.email)
        except HTTPException:
            create_user_in_db(session, user_info.email)
            user_role = get_user_role(session, user_info.email)
        user_is_psd_init = get_user_is_psd_init(session, user_info.email)

        if user_is_psd_init:
            print(user_info.email, user_info.password)
            login_response = await post_request(User_APIs.POST_LOGIN, params={"email": user_info.email, "password": user_info.password}) 
        else:
            login_response = await post_request(User_APIs.POST_LOGIN, params={"email": user_info.email, "password": user_info.email})

        if login_response.status_code != 200:
            raise HTTPException(status_code=login_response.status_code, detail="External API error.(login)")
        
        login_data = login_response.json()

        # if login_data & login_data['result']:
        if login_data:
            return {"result": True,"role": user_role, "token": login_data['access_token'],"is_psd_init":user_is_psd_init,  "message": "Login successful."}
        else:
            return {"result": False, "message": "Login failed."}
    else:
        if user_info.email != user_info.password:
            raise HTTPException(status_code=400, detail="Email not registered.")
        create_user_response = await post_request(User_APIs.POST_CREATE_USER, json={"id":1,"name":"自動創建（教室管理系統）","email": user_info.email,"password": user_info.email})
        if create_user_response.status_code != 200:
            raise HTTPException(status_code=create_user_response.status_code, detail="External API error.(create user)")
        
        data = create_user_response.json()
        # if data['result']:
        if data:
            print("創建User成功")
            try:
                create_user_in_db(session, user_info.email)
            except HTTPException:
                pass
            login_response = await post_request(User_APIs.POST_LOGIN, params={"email": user_info.email, "password": user_info.email})
            if login_response.status_code != 200:
                raise HTTPException(status_code=login_response.status_code, detail="External API error.(login)(Create!)")
            
            data = login_response.json()
            user_role = get_user_role(session, user_info.email)
            user_is_psd_init = get_user_is_psd_init(session, user_info.email)
            # if data['result']:
            if data:
                print("登入成功")
                return {"result": True,"role":user_role, "token": data['access_token'], "is_psd_init":user_is_psd_init, "message": "No Email. Created. Login successful."}
            else:
                return {"result": False,"message": "No Email. Created. Login failed."}
        else:
            raise HTTPException(status_code=400, detail="Create user failed.")