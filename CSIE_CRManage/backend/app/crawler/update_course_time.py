# update_course_time.py
from sqlmodel import select
from app.database import get_session
from app.models.course_time import CourseTime, DayOfWeek
from app.models.course_info import CourseInfo
from app.models.classroom import Classroom
from app.crawler.nfu_classroom_crawler import fetch_class_schedules

def store_course_time(crawled_data: dict):
    """
    根據爬蟲資料存入 CourseTime 表。
    crawled_data 格式示例：
      {
          "學年": "113",
          "學期": "2",
          "課程": "基本電學",
          "教授": "王教授",
          "星期": "一",
          "教室": "BGC0501"
      }
    其中：
      - course_info_id 透過查詢 CourseInfo 得到
      - day_of_week 透過將中文星期轉換為 DayOfWeek 枚舉（保留 ENUM 型態）
      - classroom_id 透過查詢 Classroom（以教室代號作為名稱）取得該筆資料在 Classroom 表中的序號
    """
    session = next(get_session())
    
    # 取得對應 CourseInfo (必須先匯入 CourseInfo 資料)
    course_info = session.exec(
        select(CourseInfo).where(
            CourseInfo.year == int(crawled_data["學年"]),
            CourseInfo.semester == int(crawled_data["學期"]),
            CourseInfo.course_name == crawled_data["課程"],
            CourseInfo.teacher_name == crawled_data["教授"]
        )
    ).first()
    if not course_info:
        print("找不到對應的 CourseInfo，請先匯入 CourseInfo 資料")
        session.close()
        return

    # 取得或建立 Classroom（以教室代號為名稱）
    classroom = session.exec(
        select(Classroom).where(Classroom.name == crawled_data["教室"])
    ).first()
    if not classroom:
        # 若不存在，建立新的 Classroom 記錄
        classroom = Classroom(name=crawled_data["教室"], is_active=True)
        session.add(classroom)
        session.commit()
        session.refresh(classroom)

    # 將中文星期轉換成數字，然後再轉換成 DayOfWeek 枚舉
    day_map = {
        "日": 0,
        "一": 1,
        "二": 2,
        "三": 3,
        "四": 4,
        "五": 5,
        "六": 6
    }
    day_str = crawled_data.get("星期")
    day_number = day_map.get(day_str)
    if day_number is None:
        print("無法識別星期:", day_str)
        session.close()
        return
    day_enum = DayOfWeek(day_number)

    # 檢查 CourseTime 是否已存在 (同一課程、同一教室、同一星期)
    course_time = session.exec(
        select(CourseTime).where(
            CourseTime.course_info_id == course_info.id,
            CourseTime.classroom_id == classroom.id,
            CourseTime.day_of_week == day_enum
        )
    ).first()
    if not course_time:
        course_time = CourseTime(
            course_info_id=course_info.id,
            classroom_id=classroom.id,
            day_of_week=day_enum
        )
        session.add(course_time)
        session.commit()
        session.refresh(course_time)
        print("新增 CourseTime:", course_time)
    else:
        print("已存在相同 CourseTime:", course_time)
    
    session.close()

def update_course_time_from_crawler():
    """
    呼叫爬蟲取得最新課表資料，並針對每筆資料更新 CourseTime 表。
    """
    schedules = fetch_class_schedules()
    for data in schedules:
        store_course_time(data)
    print("所有爬蟲資料已更新到 CourseTime 表中。")

if __name__ == "__main__":
    update_course_time_from_crawler()
