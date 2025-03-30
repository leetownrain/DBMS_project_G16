from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import date

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