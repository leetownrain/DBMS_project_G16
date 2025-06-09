from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.models.section import Section, SectionCreate
from app.database import get_session

router = APIRouter(prefix="/sections", tags=["Section"])

@router.get("/section_info", response_model=list[Section])
def get_sections(session: Session = Depends(get_session)):
    return session.exec(select(Section)).all()

@router.get("/{section_id}", response_model=Section)
def get_section(section_id: int, session: Session = Depends(get_session)):
    section = session.get(Section, section_id)
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    return section

@router.post("/", response_model=Section)
def create_section(data: SectionCreate, session: Session = Depends(get_session)):
    new_section = Section(**data.dict())
    session.add(new_section)
    session.commit()
    session.refresh(new_section)
    return new_section

@router.put("/{section_id}", response_model=Section)
def update_section(section_id: int, updated: Section, session: Session = Depends(get_session)):
    section = session.get(Section, section_id)
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    section.name = updated.name
    section.start_time = updated.start_time
    section.end_time = updated.end_time
    section.course_time_id = updated.course_time_id
    session.commit()
    session.refresh(section)
    return section

@router.delete("/{section_id}")
def delete_section(section_id: int, session: Session = Depends(get_session)):
    section = session.get(Section, section_id)
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    session.delete(section)
    session.commit()
    return {"ok": True}
