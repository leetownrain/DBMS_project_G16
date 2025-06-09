from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import SQLModel, Session
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.database import get_session

from app.urls import User_APIs

from app.services.http_logic import get_request, post_request
from app.services.Auth_logic import create_user_in_db, get_user_role, get_user_is_psd_init, get_user_name
from app.services.token_service import get_current_user

auth_router = APIRouter(prefix="/auth", tags=["auth"])
security = HTTPBearer()
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
            user_name = get_user_name(session, user_info.email)
        except HTTPException:
            create_user_in_db(session, user_info.email)
            user_role = get_user_role(session, user_info.email)
            user_name = get_user_name(session, user_info.email)
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
            return {"result": True,"role": user_role, "token": login_data['access_token'],"is_psd_init":user_is_psd_init, "name":user_name,  "message": "Login successful."}
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
            user_name = get_user_name(session, user_info.email)
            # if data['result']:
            if data:
                print("登入成功")
                return {"result": True,"role":user_role, "token": data['access_token'], "is_psd_init":user_is_psd_init, "name":user_name, "message": "No Email. Created. Login successful."}
            else:
                return {"result": False,"message": "No Email. Created. Login failed."}
        else:
            raise HTTPException(status_code=400, detail="Create user failed.")
        
@auth_router.get("/verify_token")
async def verify_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session)
):
    token = credentials.credentials  # 從 Authorization header 拿 token

    # 🔐 呼叫外部 API 驗證 token 有效性
    verify_response = await get_request(User_APIs.GET_VERIFY_TOKEN, params={"token": token})
    if verify_response.status_code != 200:
        raise HTTPException(status_code=verify_response.status_code, detail="外部 API 錯誤 (verify token)")

    verify_data = verify_response.json()

    if verify_data.get("result") and verify_data.get("email"):
        email = verify_data["email"]
        role = get_user_role(session, email)
        is_init = get_user_is_psd_init(session, email)

        print("驗證成功")
        print("email:", email)
        print("role:", role)
        print("is_init:", is_init)

        if role:
            return {
                "result": True,
                "role": role,
                "is_psd_init": is_init,
                "message": "Token 驗證成功"
            }
        else:
            return {
                "result": False,
                "message": "使用者資料不完整（角色缺失）"
            }

    # 外部 API 回傳驗證失敗
    return {
        "result": False,
        "message": "Token 驗證失敗"
    }