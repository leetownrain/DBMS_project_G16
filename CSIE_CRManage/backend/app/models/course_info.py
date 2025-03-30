from sqlmodel import SQLModel, Field, Relationship
from typing import Optional,List

class CourseInfo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    year: int
    semester: int
    course_name: str
    teacher_name: str

    course_times: List['CourseTime'] = Relationship(back_populates='course_info')
