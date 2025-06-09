from sqlmodel import SQLModel, Field

class Course(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str = Field(max_length=20)
    teacher: str = Field(max_length=20)
    academic_year: int
    semester: int
