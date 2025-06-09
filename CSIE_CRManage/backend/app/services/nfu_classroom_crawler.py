from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import json

index_url = "https://m.nfu.edu.tw/plab/index"

classrooms = [
    {"year": "113", "seme": "2", "category": "B", "building": "GC,綜三館", "classroom": "BGC0501,BGC0501-基本電學與證照實驗室"},
    {"year": "113", "seme": "2", "category": "B", "building": "GC,綜三館", "classroom": "BGC0513,BGC0513-生物資訊實驗室"},
    {"year": "113", "seme": "2", "category": "B", "building": "GC,綜三館", "classroom": "BGC0601,BGC0601-IC設計實驗室"},
    {"year": "113", "seme": "2", "category": "B", "building": "GC,綜三館", "classroom": "BGC0614,BGC0614-數位學習實驗室"},
    {"year": "113", "seme": "2", "category": "B", "building": "RA,科技研究中心", "classroom": "BRA0102,BRA0102-AI機器人實驗室"},
    {"year": "113", "seme": "2", "category": "B", "building": "RA,科技研究中心", "classroom": "BRA0201,BRA0201-AI數位人類實驗室"}
]

def run_crawler():
    all_schedules_full = []
    all_schedules_simple = []
    options = Options()
    options.add_argument("--headless")
    driver = webdriver.Chrome(options=options)

    for classroom_data in classrooms:
        classroom_code = classroom_data["classroom"].split(",")[0]
        try:
            driver.get(index_url)

            Select(WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.NAME, "year")))).select_by_value(classroom_data["year"])
            Select(WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.NAME, "seme")))).select_by_value(classroom_data["seme"])
            Select(WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.NAME, "category")))).select_by_value(classroom_data["category"])

            driver.execute_script("changeBuilding(arguments[0], arguments[1]);", classroom_data["category"], classroom_data["building"])
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, f"//select[@name='building']/option[@value='{classroom_data['building']}']")))
            Select(WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.NAME, "building")))).select_by_value(classroom_data["building"])

            driver.execute_script("changeClassroom(document.forms[0]);")
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, f"//select[@name='classroom']/option[@value='{classroom_data['classroom']}']")))
            Select(WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.NAME, "classroom")))).select_by_value(classroom_data["classroom"])

            WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.NAME, "submit"))).click()
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "nonfocal")))

            soup = BeautifulSoup(driver.page_source, "html.parser")
            table = soup.find("table", id="table")
            if not table:
                continue

            header_cells = table.find("tr").find_all("th")[1:]
            days_from_table = [cell.text.strip() for cell in header_cells]

            rows = table.find_all("tr")[1:]
            for row in rows:
                cells = row.find_all("td")
                session_num = cells[0].text.strip()
                for day_idx, cell in enumerate(cells[1:], start=0):
                    if cell.text.strip():
                        course_name = cell.contents[0].strip() if cell.contents else ""
                        professor_name = cell.find("span").text.strip() if cell.find("span") else ""
                        if course_name:
                            all_schedules_full.append({
                                "學年": classroom_data["year"],
                                "學期": classroom_data["seme"],
                                "教室": classroom_code,
                                "星期": days_from_table[day_idx],
                                "節次": session_num,
                                "課程": course_name,
                                "教授": professor_name
                            })
                            all_schedules_simple.append({
                                "學年": classroom_data["year"],
                                "學期": classroom_data["seme"],
                                "教室": classroom_code,
                                "課程": course_name,
                                "教授": professor_name
                            })

        except Exception as e:
            print(f"Error crawling {classroom_code}: {e}")
            continue

    driver.quit()

    with open("classroom_schedules_full.json", "w", encoding="utf-8") as f:
        json.dump(all_schedules_full, f, ensure_ascii=False, indent=2)

    with open("classroom_schedules_simple.json", "w", encoding="utf-8") as f:
        json.dump(all_schedules_simple, f, ensure_ascii=False, indent=2)

    return {"full_count": len(all_schedules_full), "simple_count": len(all_schedules_simple)}
