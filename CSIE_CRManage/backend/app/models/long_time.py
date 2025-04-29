from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from datetime import date

if TYPE_CHECKING:
    from app.models.booking import Booking

class LongTermBorrow(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    start_date: date = Field(..., description="借用的開始日期")
    end_date: date = Field(..., description="借用的結束日期")
    start_section: int = Field(foreign_key='section.id', description="開始的節次")
    end_section: int = Field(foreign_key='section.id', description="結束的節次")
    
    bookings: List['Booking'] = Relationship(back_populates='long_time')
