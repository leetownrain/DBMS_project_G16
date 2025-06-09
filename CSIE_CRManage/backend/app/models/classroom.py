from sqlmodel import SQLModel, Field

class Classroom(SQLModel, table=True):
    id: str = Field(default=None, primary_key=True)
    name: str = Field(max_length=20)
    capacity: int = Field(default=0)
    isActive: bool = Field(default=True)

class ClassroomCreate(SQLModel):
    id: str
    name: str
    capacity: int = 0
    isActive: bool = True

class ClassroomUpdate(SQLModel):
    name: str = None
    capacity: int = None
    isActive: bool = None
