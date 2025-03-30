import jwt
import os
import datetime
from passlib.context import CryptContext
from dotenv import load_dotenv
from fastapi import HTTPException
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from fastapi import HTTPException, Request
from app.models import User  # 假设你有 User 模型

# 載入環境變數
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")  # 加载 SECRET_KEY 环境变量
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_SECONDS = 300  # Token 過期時間

# 密碼加密設定
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 密碼哈希
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# 驗證密碼
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# 產生 JWT Token
def create_access_token(data: dict, expires_delta: int = ACCESS_TOKEN_EXPIRE_SECONDS):
    to_encode = data.copy()
    expire = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(seconds=expires_delta)
    to_encode.update({"exp": expire})

    jwt_token = jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")  # 確保這裡是 HS256


    return jwt_token

# 驗證 JWT Token
def decode_access_token(token: str):
    print(f"收到的 Token: {token}")  # 確保這是 JWT 而不是加密過的內容
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(f"解碼後的 Token 資料: {payload}")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail={"message": "Token has expired"})
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail={"message": "Invalid token"})

# 驗證用戶身份
def authenticate_user(session: Session, email: str, password: str):
    # 查找数据库中的用户
    user = session.query(User).filter(User.email == email).first()
    if user and verify_password(password, user.password):
        return user
    return None

# FastAPI 身分驗證
security = HTTPBearer()

def validate_token(token: str):
    """驗證 Token 的有效性"""
    try:
       
        payload = decode_access_token(token)
        if not payload:
            raise HTTPException(status_code=401, detail={"message": "Invalid or expired token"})
        return payload
    except Exception as e:
        raise HTTPException(status_code=401, detail={"message": f"Error decoding token: {str(e)}"})


def get_current_user(request: Request):
    authorization: str = request.headers.get("Authorization")
    if not authorization:
        raise HTTPException(status_code=401, detail={"message": "Authorization header missing"})
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail={"message": "Invalid token prefix"})
    
 
    token = authorization.split("Bearer ")[1]
    
    return validate_token(token) 
