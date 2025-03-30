from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.course_info import CourseInfo
    from app.models.section import Section
    from app.models.booking import Booking

class CourseTime(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    course_info_id: int = Field(foreign_key='courseinfo.id')
    day_of_week: int
    classroom_id: int = Field(foreign_key='classroom.id')

    course_info: 'CourseInfo' = Relationship(back_populates='course_times')
    sections: List['Section'] = Relationship(back_populates='course_time')
    bookings: List['Booking'] = Relationship(back_populates='course_time')