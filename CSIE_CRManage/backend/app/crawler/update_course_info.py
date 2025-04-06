from sqlmodel import select
from app.database import get_session
from app.models.course_info import CourseInfo
from app.crawler.nfu_classroom_crawler import fetch_class_schedules

def store_course_info(crawled_data: dict):

    session = next(get_session())

    # 檢查是否已有相同記錄
    course_info = session.exec(
        select(CourseInfo).where(
            CourseInfo.year == int(crawled_data["學年"]),
            CourseInfo.semester == int(crawled_data["學期"]),
            CourseInfo.course_name == crawled_data["課程"],
            CourseInfo.teacher_name == crawled_data["教授"]
        )
    ).first()

    # 如果沒有就將爬蟲抓來的資料轉換為對應格式並匯入資料庫
    if not course_info:
        course_info = CourseInfo(
            year=int(crawled_data["學年"]),
            semester=int(crawled_data["學期"]),
            course_name=crawled_data["課程"],
            teacher_name=crawled_data["教授"]
        )
        session.add(course_info)
        session.commit()
        session.refresh(course_info)
        print("新增 CourseInfo:", course_info)
    else:
        print("已存在相同 CourseInfo:", course_info)

    session.close()

# 抓課表
def update_all_from_crawler():
    schedules = fetch_class_schedules()
    for data in schedules:
        store_course_info(data)
    print("所有爬蟲資料已存入 CourseInfo 表中。")

if __name__ == "__main__":
    update_all_from_crawler()
