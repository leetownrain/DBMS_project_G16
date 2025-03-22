from sqlmodel import SQLModel, Field
from typing import Optional

class User(SQLModel, table=True):
    __tablename__ = "users"  # 設定資料表名稱為 "users"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str
    password: str
