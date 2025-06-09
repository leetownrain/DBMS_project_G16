from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select, SQLModel
from typing import List
from datetime import date

from app.database import get_session
from app.models.booking import Booking
from app.models.section import Section
from app.models.reservation_period import ReservationPeriod

router = APIRouter(prefix="/bookings", tags=["Booking"])

class BookingCreatePayload(SQLModel):
    applicant_id: str
    applicant_name: str
    applicant_email: str
    applicant_phone: str
    unit: str
    teacher: str
    reason: str
    date: date
    section_ids: List[int]  # 對應時段 ID，一次可選多節
    classroom_id: str

@router.post("/", response_model=Booking)
def create_booking(payload: BookingCreatePayload, session: Session = Depends(get_session)):
    # 建立 booking 主資料
    booking = Booking(
        applicant_id=payload.applicant_id,
        applicant_name=payload.applicant_name,
        applicant_email=payload.applicant_email,
        applicant_phone=payload.applicant_phone,
        unit=payload.unit,
        teacher=payload.teacher,
        reason=payload.reason,
        data=payload.date,
        classroom_id=payload.classroom_id,
    )
    session.add(booking)
    session.commit()
    session.refresh(booking)

    # 建立 ReservationPeriod 關聯
    for section_id in payload.section_ids:
        section = session.get(Section, section_id)
        if not section:
            raise HTTPException(status_code=404, detail=f"Section {section_id} not found")

        reservation = ReservationPeriod(booking_id=booking.id, section_id=section_id)
        session.add(reservation)

    session.commit()
    return booking

@router.get("/by-classroom-date-range")
def get_bookings_by_classroom_date_range(
    classroom_id: str,
    start_date: date,
    end_date: date,
    session: Session = Depends(get_session)
):
    # 1. 查詢在該日期範圍的 Booking，並指定教室
    bookings = session.exec(
        select(Booking)
        .where(Booking.classroom_id == classroom_id)
        .where(Booking.data >= start_date)
        .where(Booking.data <= end_date)
    ).all()

    results = []

    for booking in bookings:
        # 2. 查詢該筆預約用到哪些節次
        rps = session.exec(
            select(ReservationPeriod)
            .where(ReservationPeriod.booking_id == booking.id)
        ).all()

        for rp in rps:
            section = session.get(Section, rp.section_id)
            if section:
                results.append({
                    "date": booking.data,
                    "classroom": booking.classroom_id,
                    "section": section.label,
                    "applicant": booking.applicant_name,
                    "status": booking.status,
                    "reason": booking.reason,
                })

    return results
