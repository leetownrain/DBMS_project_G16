from sqlmodel import SQLModel, Field, Relationship
from typing import TYPE_CHECKING, List, Optional
from datetime import time

if TYPE_CHECKING:
    from app.models.course_time import CourseTime

class Section(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str = Field(max_length=10)
    start_time: time
    end_time: time

    course_time_id: Optional[int] = Field(default=None, foreign_key='coursetime.id')
    course_time: "CourseTime" = Relationship(back_populates="sections")

class SectionCreate(SQLModel):
    name: str
    start_time: time
    end_time: time
    course_time_id: Optional[int] = None
