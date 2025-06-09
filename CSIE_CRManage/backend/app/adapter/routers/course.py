from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models.course import Course
from app.models.course_period import CoursePeriod, DayOfWeek
from app.models.classroom import Classroom
from app.models.section import Section
import json, os

router = APIRouter(prefix="/courses", tags=["Course"])

WEEKDAY_MAP = {
    "一": DayOfWeek.MONDAY,
    "二": DayOfWeek.TUESDAY,
    "三": DayOfWeek.WEDNESDAY,
    "四": DayOfWeek.THURSDAY,
    "五": DayOfWeek.FRIDAY,
    "六": DayOfWeek.SATURDAY,
    "日": DayOfWeek.SUNDAY
}

@router.post("/import")
def import_courses_from_json(session: Session = Depends(get_session)):
    filepath = "app/data/classroom_schedules_full.json"
    if not os.path.exists(filepath):
        raise HTTPException(status_code=500, detail="找不到 JSON 檔案")

    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    created = 0
    for entry in data:
        classroom_id = entry["教室"]
        weekday_enum = WEEKDAY_MAP.get(entry["星期"])
        section_label = entry["節次"]
        course_name = entry["課程"]
        teacher = entry["教授"]
        academic_year = entry.get("學年")
        semester = entry.get("學期")

        # 找出教室（找不到則跳過）
        classroom = session.get(Classroom, classroom_id)
        if not classroom:
            continue

        # 找出 section
        section = session.exec(select(Section).where(Section.label == section_label)).first()
        if not section:
            continue

        # 查找或建立課程（需提供 academic_year 與 semester）
        course_stmt = select(Course).where(
            Course.name == course_name,
            Course.teacher == teacher,
            Course.academic_year == academic_year,
            Course.semester == semester
        )
        course = session.exec(course_stmt).first()
        if not course:
            course = Course(
                name=course_name,
                teacher=teacher,
                academic_year=academic_year,
                semester=semester
            )
            session.add(course)
            session.commit()
            session.refresh(course)
            created += 1

        # 建立課程時段
        period_stmt = select(CoursePeriod).where(
            CoursePeriod.course_id == course.id,
            CoursePeriod.classroom_id == classroom_id,
            CoursePeriod.day_of_week == weekday_enum,
            CoursePeriod.section_id == section.id
        )
        period_obj = session.exec(period_stmt).first()
        if not period_obj:
            new_period = CoursePeriod(
                course_id=course.id,
                classroom_id=classroom_id,
                day_of_week=weekday_enum,
                section_id=section.id
            )
            session.add(new_period)
            session.commit()

    return {"message": f"課程匯入完成，共新增 {created} 筆課程"}

@router.post("/", response_model=Course)
def create_course(course: Course, session: Session = Depends(get_session)):
    session.add(course)
    session.commit()
    session.refresh(course)
    return course

@router.get("/", response_model=list[Course])
def read_courses(session: Session = Depends(get_session)):
    return session.exec(select(Course)).all()

@router.get("/by-classroom/{classroom_id}")
def get_courses_by_classroom(classroom_id: str, session: Session = Depends(get_session)):
    periods = session.exec(
        select(CoursePeriod).where(
            CoursePeriod.classroom_id == classroom_id
        )
    ).all()

    result = []
    for p in periods:
        course = session.get(Course, p.course_id)
        section = session.get(Section, p.section_id)
        if course and section and course.academic_year == 113 and course.semester == 2:
            result.append({
                "course_name": course.name,
                "teacher": course.teacher,
                "weekday": p.day_of_week.name,
                "day_of_week": p.day_of_week,
                "section": section.label
            })
    return result

@router.post("/{course_id}/periods", response_model=CoursePeriod)
def add_course_period(course_id: int, period: CoursePeriod, session: Session = Depends(get_session)):
    course = session.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    period.course_id = course_id
    session.add(period)
    session.commit()
    session.refresh(period)
    return period

@router.get("/periods", response_model=list[CoursePeriod])
def get_all_periods(session: Session = Depends(get_session)):
    return session.exec(select(CoursePeriod)).all()

@router.get("/{course_id}/periods", response_model=list[CoursePeriod])
def get_course_periods(course_id: int, session: Session = Depends(get_session)):
    return session.exec(select(CoursePeriod).where(CoursePeriod.course_id == course_id)).all()