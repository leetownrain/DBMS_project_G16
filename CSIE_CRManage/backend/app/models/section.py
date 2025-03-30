from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import time

class Section(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    start_period: time
    end_period: time
    course_time_id: int = Field(foreign_key='coursetime.id')

    course_time: 'CourseTime' = Relationship(back_populates='sections')