from sqlmodel import SQLModel, Field,CheckConstraint
from typing import Optional


class User(SQLModel, table=True):
    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint("email LIKE '%_@__%.__%'"), 
    )
    id: Optional[int] = Field(default=None, primary_key=True) 
    name: str = Field(max_length=20)
    email: str = Field(max_length=50, unique=True)
    password: str
