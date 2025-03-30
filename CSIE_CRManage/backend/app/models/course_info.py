from sqlmodel import SQLModel, Field, Relationship
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.course_time import CourseTime

class CourseInfo(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    year: int
    semester: int
    course_name: str = Field(max_length=20)
    teacher_name: str = Field(max_length=20)

    course_times: List['CourseTime'] = Relationship(back_populates='course_info')
