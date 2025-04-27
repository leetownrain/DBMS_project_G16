from sqlmodel import SQLModel, Field, Relationship
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.booking import Booking

class Classroom(SQLModel, table=True):
    id: str = Field(default=None, primary_key=True)
    name: str = Field(max_length=20)
    isActive: bool = Field(default=True)

    bookings: List['Booking'] = Relationship(back_populates='classroom')

class ClassroomCreate(SQLModel):
    id: str
    name: str
    isActive: bool = True

class ClassroomUpdate(SQLModel):
    name: str = None
    isActive: bool = None