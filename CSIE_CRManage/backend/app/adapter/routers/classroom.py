from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.models.classroom import Classroom, ClassroomCreate, ClassroomUpdate
from app.database import get_session

router = APIRouter(prefix="/classrooms", tags=["Classroom"])

# 取得所有教室
@router.get("/", response_model=list[Classroom])
def get_classrooms(session: Session = Depends(get_session)):
    statement = select(Classroom).order_by(Classroom.name)
    return session.exec(statement).all()

# 取得單一教室
@router.get("/{classroom_id}", response_model=Classroom)
def get_classroom(classroom_id: str, session: Session = Depends(get_session)):
    classroom = session.get(Classroom, classroom_id)
    if not classroom:
        raise HTTPException(status_code=404, detail="Classroom not found")
    return classroom

# 建立新教室
@router.post("/", response_model=Classroom)
def create_classroom(data: ClassroomCreate, session: Session = Depends(get_session)):
    new_classroom = Classroom(**data.dict())
    session.add(new_classroom)
    session.commit()
    session.refresh(new_classroom)
    return new_classroom

# 更新教室
@router.put("/{classroom_id}", response_model=Classroom)
def update_classroom(classroom_id: str, data: ClassroomUpdate, session: Session = Depends(get_session)):
    classroom = session.get(Classroom, classroom_id)
    if not classroom:
        raise HTTPException(status_code=404, detail="Classroom not found")

    if data.name is not None:
        classroom.name = data.name
    if data.capacity is not None:
        classroom.capacity = data.capacity
    if data.isActive is not None:
        classroom.isActive = data.isActive

    session.commit()
    session.refresh(classroom)
    return classroom