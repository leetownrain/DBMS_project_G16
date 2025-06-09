from sqlmodel import SQLModel, Field, Relationship
from typing import List, TYPE_CHECKING
from datetime import time
from app.models.reservation_period import ReservationPeriod

if TYPE_CHECKING:
    from app.models.booking import Booking

class Section(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    label: str = Field(max_length=10)
    start_time: time
    end_time: time

    bookings: List["Booking"] = Relationship(
        back_populates="sections", link_model=ReservationPeriod
    )

class SectionCreate(SQLModel):
    label: str
    start_time: time
    end_time: time

class SectionUpdate(SQLModel):
    label: str = None
    start_time: time = None
    end_time: time = None
