from sqlmodel import SQLModel, Field

class CourseInfo(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    year: int
    semester: int
    course_name: str = Field(max_length=20)
    teacher_name: str = Field(max_length=20)
