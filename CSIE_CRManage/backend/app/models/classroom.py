from sqlmodel import SQLModel, Field, Relationship
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.course_time import CourseTime
    from app.models.booking import Booking

class Classroom(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str = Field(max_length=20)
    is_active: bool = Field(default=True)

    courses: List['CourseTime'] = Relationship(back_populates='classroom')
    bookings: List['Booking'] = Relationship(back_populates='classroom')
