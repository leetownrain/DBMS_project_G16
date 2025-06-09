from sqlmodel import SQLModel, Field, Relationship
from typing import List, TYPE_CHECKING
from datetime import date
from enum import Enum
from app.models.reservation_period import ReservationPeriod

if TYPE_CHECKING:
    from app.models.section import Section

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
    unit: str = Field(max_length=20)
    teacher: str = Field(max_length=20)
    reason: str = Field(max_length=100)
    status: VerifyStatusEnum = Field(default=VerifyStatusEnum.under_review)
    data: date
    classroom_id: str = Field(foreign_key="classroom.id")

    sections: List["Section"] = Relationship(
        back_populates="bookings", link_model=ReservationPeriod
    )
