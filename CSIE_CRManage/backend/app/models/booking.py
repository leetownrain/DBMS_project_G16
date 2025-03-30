from sqlmodel import SQLModel, Field, Relationship
from typing import TYPE_CHECKING
from datetime import date

if TYPE_CHECKING:
    from app.models.classroom import Classroom
    from app.models.course_time import CourseTime

class Booking(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    applicant_id: str = Field(max_length=8)
    applicant_name: str = Field(max_length=20)
    applicant_email: str = Field(max_length=50)
    applicant_phone: str = Field(max_length=10)
    unit: str = Field(max_length=20)
    teacher: str = Field(max_length=20)
    reason: str = Field(max_length=100)
    classroom_id: int = Field(foreign_key='classroom.id')
    start_date: date
    end_date: date
    section_start_id: int = Field(foreign_key='section.id')
    section_end_id: int = Field(foreign_key='section.id')
    is_approved: bool = Field(default=False)

    classroom: 'Classroom' = Relationship(back_populates='bookings')
    course_time: 'CourseTime' = Relationship(back_populates='bookings')