from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.models.section import Section, SectionCreate, SectionUpdate
from app.database import get_session

router = APIRouter(prefix="/sections", tags=["Section"])

# 取得所有節次（依開始時間排序）
@router.get("/section_info", response_model=list[Section])
def get_sections(session: Session = Depends(get_session)):
    statement = select(Section).order_by(Section.start_time)
    return session.exec(statement).all()

# 取得單一節次
@router.get("/{section_id}", response_model=Section)
def get_section(section_id: int, session: Session = Depends(get_session)):
    section = session.get(Section, section_id)
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    return section

# 建立新節次
@router.post("/", response_model=Section)
def create_section(data: SectionCreate, session: Session = Depends(get_session)):
    new_section = Section(**data.dict())
    session.add(new_section)
    session.commit()
    session.refresh(new_section)
    return new_section

# 更新節次（全部欄位）
@router.put("/{section_id}", response_model=Section)
def update_section(section_id: int, updated: SectionUpdate, session: Session = Depends(get_session)):
    section = session.get(Section, section_id)
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")

    if updated.label is not None:
        section.label = updated.label
    if updated.start_time is not None:
        section.start_time = updated.start_time
    if updated.end_time is not None:
        section.end_time = updated.end_time

    session.commit()
    session.refresh(section)
    return section