from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING
from datetime import date

if TYPE_CHECKING:
    from app.models.classroom import Classroom
    from app.models.course_time import CourseTime

class Booking(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    applicant_id: str
    applicant_name: str
    applicant_email: str
    applicant_phone: str
    unit: str
    teacher: str
    reason: str
    classroom_id: int = Field(foreign_key='classroom.id')
    start_date: date
    end_date: date
    section_start_id: int = Field(foreign_key='section.id')
    section_end_id: int = Field(foreign_key='section.id')
    is_approved: bool = False

    classroom: 'Classroom' = Relationship(back_populates='bookings')
    course_time: 'CourseTime' = Relationship(back_populates='bookings')