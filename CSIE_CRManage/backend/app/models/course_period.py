from sqlmodel import SQLModel, Field
from enum import Enum

class DayOfWeek(int, Enum):
    SUNDAY = 0
    MONDAY = 1
    TUESDAY = 2
    WEDNESDAY = 3
    THURSDAY = 4
    FRIDAY = 5
    SATURDAY = 6

class CoursePeriod(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    course_id: int = Field(foreign_key="course.id")
    classroom_id: str = Field(foreign_key="classroom.id")
    section_id: int = Field(foreign_key="section.id")
    day_of_week: DayOfWeek
