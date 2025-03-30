from sqlmodel import SQLModel, Field, Relationship
from typing import List, TYPE_CHECKING
from enum import Enum

if TYPE_CHECKING:
    from app.models.course_info import CourseInfo
    from app.models.section import Section
    from app.models.booking import Booking

class DayOfWeek(int, Enum):
    SUNDAY = 0
    MONDAY = 1
    TUESDAY = 2
    WEDNESDAY = 3
    THURSDAY = 4
    FRIDAY = 5
    SATURDAY = 6

class CourseTime(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    course_info_id: int = Field(foreign_key='courseinfo.id')
    day_of_week: DayOfWeek
    classroom_id: int = Field(foreign_key='classroom.id')

    course_info: 'CourseInfo' = Relationship(back_populates='course_times')
    sections: List['Section'] = Relationship(back_populates='course_time')
    bookings: List['Booking'] = Relationship(back_populates='course_time')