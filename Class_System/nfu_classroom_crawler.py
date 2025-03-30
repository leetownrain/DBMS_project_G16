from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import json

# 學校教室使用時間選單網址
index_url = "https://m.nfu.edu.tw/plab/index"

# 到選單時要爬的教室清單
classrooms = [
    {"year": "113", "seme": "2", "category": "B", "building": "GC,綜三館", "classroom": "BGC0501,BGC0501-基本電學與證照實驗室"},
    {"year": "113", "seme": "2", "category": "B", "building": "GC,綜三館", "classroom": "BGC0513,BGC0513-生物資訊實驗室"},
    {"year": "113", "seme": "2", "category": "B", "building": "GC,綜三館", "classroom": "BGC0601,BGC0601-IC設計實驗室"},
    {"year": "113", "seme": "2", "category": "B", "building": "GC,綜三館", "classroom": "BGC0614,BGC0614-數位學習實驗室"},
    {"year": "113", "seme": "2", "category": "B", "building": "RA,科技研究中心", "classroom": "BRA0102,BRA0102-AI機器人實驗室"},
    {"year": "113", "seme": "2", "category": "B", "building": "RA,科技研究中心", "classroom": "BRA0201,BRA0201-AI數位人類實驗室"}
]

all_schedules_full = []# 儲存教室完整課程清單
all_schedules_simple = []# 儲存教室簡要課程清單

options = Options()
options.add_argument("--headless")  # 讓瀏覽器在背景執行
driver = webdriver.Chrome(options=options)

for classroom_data in classrooms:
    # 只取教室代號 (例如 "BGC0501")
    classroom_code = classroom_data["classroom"].split(",")[0]

    try:
        driver.get(index_url)

        # 選擇學年
        year_select = Select(WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.NAME, "year"))
        ))
        year_select.select_by_value(classroom_data["year"])
        print(f"選擇學年: {year_select.first_selected_option.get_attribute('value')}")

        # 選擇學期
        seme_select = Select(WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.NAME, "seme"))
        ))
        seme_select.select_by_value(classroom_data["seme"])
        print(f"選擇學期: {seme_select.first_selected_option.get_attribute('value')}")

        # 選擇教學區
        category_select = Select(WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.NAME, "category"))
        ))
        category_select.select_by_value(classroom_data["category"])
        print(f"選擇教學區: {category_select.first_selected_option.get_attribute('value')}")

        # 執行 JS 函數 changeBuilding
        driver.execute_script("changeBuilding(arguments[0], arguments[1]);", classroom_data["category"],
                              classroom_data["building"])
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
                (By.XPATH, f"//select[@name='building']/option[@value='{classroom_data['building']}']"))
        )

        # 選擇建築
        building_select = Select(WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.NAME, "building"))
        ))
        building_select.select_by_value(classroom_data["building"])
        print(f"選擇建築物: {building_select.first_selected_option.get_attribute('value')}")

        # 執行 JS 函數 changeClassroom
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
        print(f"選擇教室: {classroom_select.first_selected_option.get_attribute('value')}")

        # 提交表單
        submit_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.NAME, "submit"))
        )
        submit_button.click()

        # 等待結果頁面
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "nonfocal"))
        )

        # 解析頁面
        soup = BeautifulSoup(driver.page_source, "html.parser")
        nonfocal_div = soup.find("div", class_="nonfocal")

        if not nonfocal_div or not nonfocal_div.find("h2"):
            print(f"爬取 {classroom_code} 失敗：未找到結果頁面")
            continue

        # 從 <h2> 標籤中提取文字，只取教室代號
        title = nonfocal_div.find("h2").text.strip()
        parts = title.split(" / ")
        title_parts = parts[0].split()
        year = title_parts[0]  # 學年
        semester = title_parts[3]  # 學期
        classroom_code_from_title = parts[1].split(" 使用時間表")[0].split("-")[0]  # 只取代號部分

        # 找到表格並提取星期名稱
        table = soup.find("table", id="table")
        if not table:
            print(f"爬取 {classroom_code} 失敗：未找到表格")
            continue

        # 提取第一行的星期名稱
        header_row = table.find("tr")
        header_cells = header_row.find_all("th")
        days_from_table = [cell.text.strip() for cell in header_cells[1:]]  # 跳過第一個空欄

        # 解析課程資料
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
                        # 第一個 JSON 含星期節次
                        all_schedules_full.append({
                            "學年": year,
                            "學期": semester,
                            "教室": classroom_code_from_title,  # 使用代號而非完整名稱
                            "星期": days_from_table[day_idx],
                            "節次": session_num,
                            "課程": course_name,
                            "教授": professor_name
                        })
                        # 第二個 JSON 不含星期節次
                        all_schedules_simple.append({
                            "學年": year,
                            "學期": semester,
                            "教室": classroom_code_from_title,
                            "課程": course_name,
                            "教授": professor_name
                        })

        print(f"成功爬取 {classroom_code} 的課程資訊")


    except Exception as e:
        print(f"爬取 {classroom_code} 失敗：{e}")
        continue

# 定義星期順序
day_order = {"一": 1, "二": 2, "三": 3, "四": 4, "五": 5, "六": 6, "日": 7}

# 對 all_schedules 進行排序：先按教室 再按星期和節次
all_schedules = sorted(all_schedules_full, key=lambda x: (x["教室"], day_order[x["星期"]], int(x["節次"])))
all_schedules_simple = sorted(all_schedules_simple, key=lambda x: (x["教室"], x["課程"]))

json_full_filename = "classroom_schedules_full.json"
with open(json_full_filename, "w", encoding="utf-8") as jsonfile:
    json.dump(all_schedules_full, jsonfile, ensure_ascii=False, indent=4)

json_simple_filename = "classroom_schedules_simple.json"
with open(json_simple_filename, "w", encoding="utf-8") as jsonfile:
    json.dump(all_schedules_simple, jsonfile, ensure_ascii=False, indent=4)

print(f"所有課程資訊已儲存至 {json_full_filename}")
print(f"所有課程資訊已儲存至 {json_simple_filename}")

# 關閉瀏覽器
driver.quit()