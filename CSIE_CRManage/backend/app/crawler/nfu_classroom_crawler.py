# nfu_classroom_crawler.py
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup

def fetch_class_schedules():

    index_url = "https://m.nfu.edu.tw/plab/index"
    classrooms = [
        {"year": "113", "seme": "2", "category": "B", "building": "GC,綜三館", "classroom": "BGC0501,BGC0501-基本電學與證照實驗室"},
        {"year": "113", "seme": "2", "category": "B", "building": "GC,綜三館", "classroom": "BGC0513,BGC0513-生物資訊實驗室"},
        {"year": "113", "seme": "2", "category": "B", "building": "GC,綜三館", "classroom": "BGC0601,BGC0601-IC設計實驗室"},
        {"year": "113", "seme": "2", "category": "B", "building": "GC,綜三館", "classroom": "BGC0614,BGC0614-數位學習實驗室"},
        {"year": "113", "seme": "2", "category": "B", "building": "RA,科技研究中心", "classroom": "BRA0102,BRA0102-AI機器人實驗室"},
        {"year": "113", "seme": "2", "category": "B", "building": "RA,科技研究中心", "classroom": "BRA0201,BRA0201-AI數位人類實驗室"}
    ]
    
    full_schedules = []
    simple_schedules = []
    options = Options()
    options.add_argument("--headless")  # 背景執行
    driver = webdriver.Chrome(options=options)
    
    for classroom_data in classrooms:
        # 取出教室代號
        classroom_code = classroom_data["classroom"].split(",")[0]
        try:
            driver.get(index_url)
            # 選擇學年
            year_select = Select(WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.NAME, "year"))
            ))
            year_select.select_by_value(classroom_data["year"])
            
            # 選擇學期
            seme_select = Select(WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.NAME, "seme"))
            ))
            seme_select.select_by_value(classroom_data["seme"])
            
            # 選擇教學區
            category_select = Select(WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.NAME, "category"))
            ))
            category_select.select_by_value(classroom_data["category"])
            
            # 執行 JS 函數變更建築
            driver.execute_script("changeBuilding(arguments[0], arguments[1]);",
                                  classroom_data["category"], classroom_data["building"])
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located(
                    (By.XPATH, f"//select[@name='building']/option[@value='{classroom_data['building']}']"))
            )
            # 選擇建築
            building_select = Select(WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.NAME, "building"))
            ))
            building_select.select_by_value(classroom_data["building"])
            
            # 執行 JS 函數變更教室
            driver.execute_script("changeClassroom(document.forms[0]);")
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located(
                    (By.XPATH, f"//select[@name='classroom']/option[@value='{classroom_data['classroom']}']"))
            )
            # 選擇教室
            classroom_select = Select(WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.NAME, "classroom"))
            ))
            classroom_select.select_by_value(classroom_data["classroom"])
            
            # 提交表單
            submit_button = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.NAME, "submit"))
            )
            submit_button.click()
            
            # 等待結果頁面出現
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "nonfocal"))
            )
            
            # 解析頁面內容
            soup = BeautifulSoup(driver.page_source, "html.parser")
            nonfocal_div = soup.find("div", class_="nonfocal")
            if not nonfocal_div or not nonfocal_div.find("h2"):
                print(f"爬取 {classroom_code} 失敗：未找到結果頁面")
                continue
            
            # 從標題解析學年、學期與教室代號
            title = nonfocal_div.find("h2").text.strip()
            parts = title.split(" / ")
            title_parts = parts[0].split()
            year_val = title_parts[0]
            semester_val = title_parts[3]
            classroom_code_from_title = parts[1].split(" 使用時間表")[0].split("-")[0]
            
            # 取得星期標題
            table = soup.find("table", id="table")
            if not table:
                print(f"爬取 {classroom_code} 失敗：未找到表格")
                continue
            header_row = table.find("tr")
            header_cells = header_row.find_all("th")
            days = [cell.text.strip() for cell in header_cells[1:]]  # 第一個欄位為空
            
            # 逐行解析課程資料（以節次為單位）
            rows = table.find_all("tr")[1:]
            for row in rows:
                cells = row.find_all("td")
                session_num = cells[0].text.strip()
                for day_idx, cell in enumerate(cells[1:], start=0):
                    if cell.text.strip():
                        course_name = cell.contents[0].strip() if cell.contents else ""
                        professor_name = ""
                        if cell.find("span"):
                            professor_name = cell.find("span").text.strip()
                        elif len(cell.contents) > 2:
                            professor_name = cell.contents[2].strip() if isinstance(cell.contents[2], str) else ""
                        if course_name:
                            # 完整資料包含星期與節次
                            full_entry = {
                                "學年": year_val,
                                "學期": semester_val,
                                "教室": classroom_code_from_title,
                                "星期": days[day_idx],
                                "節次": session_num,
                                "課程": course_name,
                                "教授": professor_name
                            }
                            # 簡易資料僅保留學年、學期、教室、課程、教授
                            simple_entry = {
                                "學年": year_val,
                                "學期": semester_val,
                                "教室": classroom_code_from_title,
                                "課程": course_name,
                                "教授": professor_name
                            }
                            full_schedules.append(full_entry)
                            simple_schedules.append(simple_entry)
            print(f"成功爬取 {classroom_code} 的課程資訊")
        except Exception as e:
            print(f"爬取 {classroom_code} 失敗：{e}")
            continue

    driver.quit()
    
    # 寫入完整資料 JSON 檔案
    try:
        with open("classroom_schedules_full.json", "w", encoding="utf-8") as f_full:
            json.dump(full_schedules, f_full, ensure_ascii=False, indent=4)
        print("所有完整課程資訊已儲存至 classroom_schedules_full.json")
    except Exception as e:
        print(f"儲存完整 JSON 檔案失敗：{e}")
    
    # 寫入簡易資料 JSON 檔案
    try:
        with open("classroom_schedules_simple.json", "w", encoding="utf-8") as f_simple:
            json.dump(simple_schedules, f_simple, ensure_ascii=False, indent=4)
        print("所有簡易課程資訊已儲存至 classroom_schedules_simple.json")
    except Exception as e:
        print(f"儲存簡易 JSON 檔案失敗：{e}")
    
    return full_schedules

if __name__ == '__main__':
    schedules = fetch_class_schedules()
    print("爬取到的完整課表資料:")
    for s in schedules:
        print(s)