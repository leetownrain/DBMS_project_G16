from fastapi import HTTPException
from sqlmodel import Session, select, asc
from app.models.classroom import Classroom, ClassroomCreate
from typing import List

def get_all_classrooms(session: Session) -> List[Classroom]:
    statement = select(Classroom).order_by(asc(Classroom.id))  # 依據 name 升冪排序
    results = session.exec(statement).all()
    return results

def create_classroom(session: Session, classroom_data: ClassroomCreate) -> Classroom:
    if session.get(Classroom, classroom_data.id):
        raise HTTPException(status_code=400, detail="教室 ID 已存在")

    if classroom_data.isActive is None:
        classroom_data.isActive = True

    classroom = Classroom.from_orm(classroom_data)
    session.add(classroom)
    session.commit()
    session.refresh(classroom)
    return classroom
