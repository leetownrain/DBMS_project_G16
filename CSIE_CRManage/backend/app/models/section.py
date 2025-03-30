from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING
from datetime import time

if TYPE_CHECKING:
    from app.models.course_time import CourseTime

class Section(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    start_period: time
    end_period: time
    course_time_id: int = Field(foreign_key='coursetime.id')

    course_time: 'CourseTime' = Relationship(back_populates='sections')