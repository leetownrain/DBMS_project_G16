from sqlmodel import SQLModel, Field

class ReservationPeriod(SQLModel, table=True):
    booking_id: int = Field(foreign_key="booking.id", primary_key=True)
    section_id: int = Field(foreign_key="section.id", primary_key=True)
