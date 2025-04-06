from enum import Enum
from sqlmodel import SQLModel, Field
from datetime import datetime

class RoleEnum(str, Enum):
    user = "user"
    admin = "admin"

class User(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    username: str = Field(max_length=20)
    email: str = Field(max_length=50, sa_column_kwargs={"unique": True})
    role: RoleEnum  # 只能是 "user" 或 "admin"
    is_psd_init: bool = Field(default=False)  # 是否已初始化密碼
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
