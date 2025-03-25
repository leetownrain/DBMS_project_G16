from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import date


# -------------------
# Classroom Table
# -------------------
class Classroom(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    is_active: bool

    orders: List["Order"] = Relationship(back_populates="classroom")
    classes: List["Class"] = Relationship(back_populates="classroom")


# -------------------
# Section Table
# -------------------
class Section(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    start_period: date
    end_period: date

    classes: List["Class"] = Relationship(back_populates="section")
    section_start_orders: List["Order"] = Relationship(back_populates="section_start", sa_relationship_kwargs={"foreign_keys": "[Order.section_start_id]"})
    section_end_orders: List["Order"] = Relationship(back_populates="section_end", sa_relationship_kwargs={"foreign_keys": "[Order.section_end_id]"})


# -------------------
# Order Table
# -------------------
class Order(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    classroom_id: int = Field(foreign_key="classroom.id")
    start_date: date
    end_date: date
    section_start_id: int = Field(foreign_key="section.id")
    section_end_id: int = Field(foreign_key="section.id")
    is_approved: bool
    reason: str
    teacher: str
    applicant_name: str
    applicant_id: str
    applicant_email: str
    applicant_phone: str
    unit: str

    classroom: Optional[Classroom] = Relationship(back_populates="orders")
    section_start: Optional[Section] = Relationship(back_populates="section_start_orders", sa_relationship_kwargs={"foreign_keys": "[Order.section_start_id]"})
    section_end: Optional[Section] = Relationship(back_populates="section_end_orders", sa_relationship_kwargs={"foreign_keys": "[Order.section_end_id]"})


# -------------------
# Class Table (course information)
# -------------------
class Class(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    year: int
    semester: int
    course_name: str
    weekday: int
    classroom_id: int = Field(foreign_key="classroom.id")
    section_id: int = Field(foreign_key="section.id")

    classroom: Optional[Classroom] = Relationship(back_populates="classes")
    section: Optional[Section] = Relationship(back_populates="classes")
