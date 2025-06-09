from sqlmodel import SQLModel, Field, Relationship
from typing import TYPE_CHECKING
from datetime import date
from enum import Enum

if TYPE_CHECKING:
    from app.models.classroom import Classroom
    from app.models.course_time import CourseTime
    from app.models.long_time import LongTermBorrow

class VerifyStatusEnum(str, Enum):
    under_review = "審核中"
    approved = "通過"
    rejected = "不通過"
    cancelled = "已取消"

class Booking(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    applicant_id: str = Field(max_length=8)
    applicant_name: str = Field(max_length=20)
    applicant_email: str = Field(max_length=50)
    applicant_phone: str = Field(max_length=10)
    teacher_unit: str = Field(max_length=20)
    teacher: str = Field(max_length=20)
    reason: str = Field(max_length=100)
    classroom_id: str = Field(foreign_key='classroom.id')
    verify_status: VerifyStatusEnum = Field(default=VerifyStatusEnum.under_review)
    booking_type: str = Field(default='線上短期借用', max_length=20) 
    course_info_id: int = Field(foreign_key='courseinfo.id')
    course_time_id: int = Field(foreign_key='coursetime.id')
    long_time_id: int = Field(default=None, foreign_key="longtermborrow.id")
    booking_date: date
    section_start_id: int = Field(foreign_key='section.id')
    section_end_id: int = Field(foreign_key='section.id')
    is_approved: bool = Field(default=False)

    classroom: 'Classroom' = Relationship(back_populates='bookings')
    
    course_time_id: int = Field(foreign_key='coursetime.id')
    course_time: 'CourseTime' = Relationship(back_populates='bookings')

    long_time: 'LongTermBorrow' = Relationship(back_populates="bookings")