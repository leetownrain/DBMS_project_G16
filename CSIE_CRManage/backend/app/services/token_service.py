import os
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv

# 載入 .env 檔案中的環境變數
load_dotenv()

# 常數設定
SECRET_KEY = os.getenv("SECRET_KEY", "DBMS_project_G16")  # 若沒設定會用 changeme
ALGORITHM = "HS256"

# 建立 FastAPI 的 HTTP Bearer 驗證方式
security = HTTPBearer()

# ✅ 解析並驗證 JWT Token
def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token 已過期"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="無效的 Token"
        )

# ✅ 提供給 FastAPI 路由使用的依賴（取得目前登入的使用者資料）
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials  # 從 headers 中取得 Bearer token
    payload = decode_access_token(token)
    
    # 可選：確保 payload 至少有 email/sub
    email = payload.get("email") or payload.get("sub")
    if not email:
        raise HTTPException(status_code=400, detail="Token 缺少 email/sub 資訊")

    return payload  # 你可以改回傳 email、role 等欄位
