from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List

from app.models.classroom import Classroom, ClassroomCreate, ClassroomUpdate
from app.database import get_session
from app.services.classroom_logic import get_all_classrooms, create_classroom

router = APIRouter(prefix="/classrooms", tags=["Classrooms"])

@router.get("/classroom_info", response_model=List[Classroom])
def read_classrooms(session: Session = Depends(get_session)):
    return get_all_classrooms(session)

@router.post("/add_classroom", response_model=Classroom)
def add_classroom(classroom_data: ClassroomCreate, session: Session = Depends(get_session)):
    return create_classroom(session, classroom_data)


@router.put("/update_classroom/{id}")
def update_classroom(id: str, data: ClassroomUpdate, session: Session = Depends(get_session)):
    classroom = session.get(Classroom, id)
    if not classroom:
        raise HTTPException(status_code=404, detail="找不到教室")

    if data.name is not None:
        classroom.name = data.name

    if data.isActive is not None:
        classroom.isActive = data.isActive

    session.add(classroom)
    session.commit()
    session.refresh(classroom)

    return {"message": "教室更新成功", "classroom": classroom}