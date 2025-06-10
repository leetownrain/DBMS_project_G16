# 教室管理系統（G16）
 
## 🧩 系統簡介

本專題「教室管理系統」是一套具備「教室借用管理」與「使用者身份驗證」功能的 Web 應用系統，旨在提升教室借用流程的效率與透明度，並提供一個操作簡便、具彈性的介面，方便學生、教師與管理員使用。系上教室每日皆有不同的借用需求，除了課表已排定的教室外，也有許多來自個人申請的使用情況。過去多以紙本方式申請，如今系上已經有一個線上借用系統，雖改善了部分便利性，卻仍存在操作不便與功能不足等問題。因此，我們希望重新設計一個更符合實際需求的系統，以提供更流暢、直覺且完善的借用與管理體驗。

系統採用模組化設計，主要拆分為以下兩大核心子系統：

- **🏫 教室借用系統（Classroom Booking System）**
  - 提供教室借用申請、查詢、審核與時段排程等功能。
  - 與 Auth Service 完整整合，依使用者角色授權操作權限。
- **🔐 身份驗證系統（Auth Service）**
   - 獨立的使用者註冊、登入與驗證模組。
   - 支援權限分級管理（如：使用者 / 管理員），確保操作安全。
   - 可作為獨立服務被其他系統整合。

---

## 📎 作業連結

### 作業一：🔗 [前往作業一連結](https://www.canva.com/design/DAGj9WScB2c/eeTuT3zUf8ARXlqzZoK71g/view?utm_content=DAGj9WScB2c&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hb68752014d)

### 作業二：🔗 [前往作業二連結](https://www.canva.com/design/DAGj9WScB2c/eeTuT3zUf8ARXlqzZoK71g/view?utm_content=DAGj9WScB2c&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hb68752014d)

### 作業三：🔗 [前往作業三連結](https://github.com/leetownrain/DBMS_project_G16/blob/develop/HW3.md)

### 期末簡報：🔗 [前往簡報連結](https://www.canva.com/design/DAGpMgow0HM/g3DIhVA1uYEhztwP-vw_2Q/view?utm_content=DAGpMgow0HM&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h9e53976d3b)
---

## 👨‍💻 專案作者

| 姓名 | 學號 | 班級 | 分工 |
|------|------|------|------|
| 吳哲瑋 | 41143213 | 四資工三乙 | 整體專案PM、資料庫架構設計、子系統開發協助 |
| 李鎮宇 | 41143216 | 四資工三乙 | 身分驗證系統前端設計、後端功能開發 |
| 林致均 | 41143222 | 四資工三乙 | 教室借用系統前端設計 |
| 陳亮祐 | 41143235 | 四資工三乙 | 教室借用系統後端功能開發 |

---

## 🌐 應用情境 (使用說明)

| 使用者 | 使用情境說明 |
|-------|-------------|
| 學生 | 小組報告或期末表演前夕，學生臨時需要空教室進行討論與練習。透過系統查詢當天空教室時段後，立即提出借用申請，並經由系統管理員線上核可，即可快速取得使用權，節省來回詢問時間。 | 
| 老師 | 鄭老師想安排一場課後補課或辦理一場專題講座，需要額外教室空間。透過系統登入後，可直接查看適合時段與空間的可用教室，並快速完成申請與公告流程，避免與其他活動衝突。 | 
| 系辦管理員 | 管理員可使用系統後台功能，統一管理每日教室借用申請，審核使用用途是否合理，並可檢視即時教室使用情況、彙整借用紀錄與統計報表，有效提升資源分配與管理效率。 |

---

## 🔍 使用者調查（User Research）

1. 借用人申請教室後，無法得知是否已通過申請。
2. 借用人若需更改申請時間，無法進行更改，容易造成重複占用的情況。
3. 管理員希望系統能提供通知功能，讓有借用需求時才進行審核，而不需要每天登入系統檢查。
4. 管理員目前只能新增資料，無法刪除已存在的紀錄。
5. 管理員每學期必須手動對照課表，更新已固定課表的教室借用情況。

---

## 📌 使用案例（Use Cases）

### 使用者：
1. **學生/老師**
   - 登入系統
   - 查詢教室空間
   - 提出借用申請
   - 查看審核狀態

2. **管理員**
   - 查看所有借用紀錄
   - 審核教室借用
   - 設定教室可用狀態與課程時段

---

## 📋 教室資料庫設計圖（ERD）

![教室管理系統 ER 圖](Picture/erer.png)


---

## 🏫 教室借用系統（Classroom Booking System）


### 🔷 一、實體資料表（Entities）

### 1. `users` – 使用者資料表

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'user'))
);
```

| 欄位名稱 | 資料型別 | 中文說明 | 是否為空值 | 完整性限制 |
|----------|---------|-----------|----|--------------|
| `id`     |   int   | 使用者編號 | 否 | 主鍵，符合學號或員工編號格式(如後) |
| `name`   | varchar | 使用者姓名 | 否 | 長度2-25字中文  正規表示式：'^[\u4e00-\u9fa5]{2,25}$' |
| `email`  | varchar | 電子郵件   | 否 | 唯一性，符合電子郵件格式(如後) |
| `role`   | varchar | 使用者角色 | 否 | 僅限 'admin' 或 'user' |

**格式說明：**  
- 使用者編號：須為「虎尾科技大學」學生之學號，共 8 碼，或是教師員工號碼，共6碼。  
  學生學號：
       第一碼　　：學制，如:D為博士、1 為碩士、3 為二技、4 為四技、5 為五專。    
       第二、三碼： 入學學年，如:11 表示 111 年入學。    
       第四、五碼：系所代碼，如:資工四技為 43、資工碩班63。    
       第六碼　　：班級代碼，如:甲班為 1、乙班為 2、攜班為9，依此類推。    
       第七、八碼：學生座號。  
       正規表示式：'^[D1345]\d{2}\d{2}[1-9](?:0[1-9]|[1-9][0-9])$'  
  
  教師員工編號：
       第一碼　　：:職位，如：教師為B，行政人員為E。  
       第二、三碼：系級，如：資工為13，通識教育中心為35等等。  
       第四碼　　：聘任類別，如：專任為0，兼任為P。  
       第五、六碼：個人編碼，如：陳國益為29。  
       正規表示式：'^[A-Z]\d{2}[0P]\d{2}$'   
- 姓名：須為"中文"名字，如:陳大餅、張中筒。
- 電子郵件：須符合電子郵件標準格式，如：使用者名稱@網域名稱，student123@nfu.edu.tw、user@gmail.com。  
正規表示式為 '^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$'

---

### 2. `classrooms` – 教室資料表

```sql
CREATE TABLE classrooms (
    id INT PRIMARY KEY NOT NULL,
    name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);
```

| 欄位名稱 | 資料型別 | 中文說明 | 是否為空值 | 完整性限制 |
|--------------|---------|---------|----|--------------|
| `id`         |   string   | 教室編號 | 否 | 主鍵，符合教室編號格式(如下) |
| `name`       | varchar | 教室名稱 | 否 | 長度3-30字（中文 英文 標點符號）如：BGC0614-數位學習實驗室 |
| `is_active`  | boolean | 是否啟用 | 否 | 預設為 TRUE |

**格式說明：**
- 教室編號⭢由"三個字母+四位數數字"組成，如:BGC0513（生物資訊實驗室）。  
     正規表示式為： '^(BGC|BRA|BCB)\d{4}$'
---

### 3. `courses` – 課程資料表

```sql
CREATE TABLE courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    teacher VARCHAR(100) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    semester VARCHAR(10) NOT NULL CHECK (semester IN ('上', '下'))
);
```

| 欄位名稱 | 資料型別 | 中文說明 | 是否為空值 | 完整性限制 |
|----------|-------------|----------|--------------|--------------|
| `id`            | int       | 課程編號     | 否 | 主鍵，自動產生 |
| `name`          | varchar   | 課程名稱     | 否 | NOT NULL |
| `teacher`       | varchar   | 授課教師姓名 | 否 | NOT NULL |
| `academic_year` | varchar   | 學年度       | 否 | NOT NULL, 格式為 4 位數 |
| `semester`      | varchar   | 學期         | 否 | NOT NULL, 僅限 '上' 或 '下' |

**格式說明：**
- 課程編號: 由"四位數字"所組成，如:1929(數位系統導論)、1933(科技文件閱讀)。
- 課程名稱: 須為"中文"課程名稱，如:數位系統導論、科技文件閱讀。
- 授課教師姓名: 須為"中文"名字，如:鄭錦聰、江季翰。
- 學年度: 須符合實際"民國年"，如:113、114。
- 學期: 僅接受以下格式，如:若為上學期，則為 1;若為下學期，則為 2。
---

### 4. `time_periods` – 時段資料表

```sql
CREATE TABLE time_periods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    label VARCHAR(50) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    CHECK (start_time < end_time)
);
```

| 欄位名稱 | 資料型別 | 中文說明 | 是否為空值 | 完整性限制 |
|----------|-------------|----------|--------|--------------|
| `id`         | int      | 時段編號 | 否 | 主鍵，自動產生 |
| `label`      | varchar  | 時段標籤 | 否 | NOT NULL |
| `start_time` | time     | 開始時間 | 否 | NOT NULL |
| `end_time`   | time     | 結束時間 | 否 | NOT NULL，必須晚於開始時間 |

**格式說明：**
- 開始時間: 符合24小時制，如: 08:00、13:00、18:00。
- 結束時間: 符合24小時制，如: 08:00、13:00、18:00。
---

### 5. `reservations` – 教室借用申請表

```sql
CREATE TABLE reservations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
    unit VARCHAR(100) NOT NULL,
    teacher VARCHAR(100) NOT NULL,
    applicant_id INT NOT NULL,
    applicant_name VARCHAR(100) NOT NULL,
    applicant_email VARCHAR(100) NOT NULL,
    applicant_phone VARCHAR(50) NOT NULL,
    classroom_id INT NOT NULL,
    FOREIGN KEY (classroom_id) REFERENCES classrooms(id)
);
```

| 欄位名稱 | 資料型別 | 中文說明 | 是否為空值 | 完整性限制 |
|----------|--------------|----------|--------------|--------------|
| `id`              | int           | 借用紀錄編號 | 否 | 主鍵，自動產生 |
| `date`            | date          | 借用日期 | 否 | NOT NULL |
| `reason`          | text          | 借用原因 | 否 | NOT NULL |
| `status`          | varchar       | 借用狀態 | 否 | NOT NULL, 限定值 |
| `unit`            | varchar       | 申請單位 | 否 | NOT NULL |
| `teacher`         | varchar       | 指導老師 | 否 | NOT NULL |
| `applicant_id`    | int           | 申請人 ID | 否 | NOT NULL |
| `applicant_name`  | varchar       | 申請人姓名 | 否 | NOT NULL |
| `applicant_email` | varchar       | 申請人信箱 | 否 | NOT NULL, Email 格式 |
| `applicant_phone` | varchar       | 申請人電話 | 否 | NOT NULL |
| `classroom_id`    | int           | 教室 ID | 否 | 外鍵 |

**外鍵說明：**
- `classroom_id` → `classrooms(id)`

**格式說明：**
- 借用日期: 符合當前日期或是未來日期，如: 2025/06/20、2026/06/01。
- 申請單位: 符合"虎科"實際存在單位，如:班級、社團、系學會，四資工二乙、熱舞社、資工系學會。
- 指導老師: 須為"中文"名字，如:鄭錦聰、江季翰。
- 申請人姓名: 須為"中文"名字，如:陳大餅、張中筒。
- 申請人信箱: 須符合電子郵件標準格式，如:使用者名稱@網域名稱，student123@nfu.edu.tw、user@gmail.com。
- 申請人電話: 須為"臺灣"行動電話號碼格式，如:0912345678。
---

### 🔶 二、關係資料表（Relationships）

### 1. `course_periods` – 課程 × 時段 × 教室 的中介表

```sql
CREATE TABLE course_periods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    time_period_id INT NOT NULL,
    classroom_id INT,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (time_period_id) REFERENCES time_periods(id) ON DELETE CASCADE,
    FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE SET NULL
);
```

| 欄位名稱 | 資料型別 | 中文說明 | 是否為空值 | 完整性限制 |
|----------|--------------|----------|---------|----------|
| `id`            | INTEGER | 編號    | 否 | 主鍵，自動產生 |
| `course_id`     | INTEGER | 課程 ID | 否 | NOT NULL, 外鍵 |
| `time_period_id`| INTEGER | 時段 ID | 否 | NOT NULL, 外鍵 |
| `classroom_id`  | INTEGER | 教室 ID | 否 | NOT NULL, 外鍵 |

**外鍵說明：**
- `course_id` → `courses(id)`  
- `time_period_id` → `time_periods(id)`  
- `classroom_id` → `classrooms(id)`
---

### 2. `reservations_periods` – 借用申請 × 時段 的中介表

```sql
CREATE TABLE reservations_periods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    reservation_id INT NOT NULL,
    time_period_id INT NOT NULL,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE,
    FOREIGN KEY (time_period_id) REFERENCES time_periods(id) ON DELETE CASCADE
);
```

| 欄位名稱 | 資料型別 | 中文說明 | 是否為空值 | 完整性限制 |
|----------|--------------|----------|-----------|--------------|
| `id`              | int | 編號        | 否 | 主鍵，自動產生 |
| `reservation_id`  | int | 借用申請 ID | 否 | NOT NULL, 外鍵 |
| `time_period_id`  | int | 時段 ID     | 否 | NOT NULL, 外鍵 |

**外鍵說明：**
- `reservation_id` → `reservations(id)`  
- `time_period_id` → `time_periods(id)`

---

## 📌 關係整理與解釋

![教室管理系統 ER 圖](Picture/rela_erd_2.png)

- 一筆 **reservation**（借用）對應一間 **classroom**（教室）→ 多對一關係
- 一門 **course**（課程）可對應多個 **time_period**（時段）→ 多對多關係，透過 `course_periods`
- 一筆 **reservation** 可對應多個 **time_period** → 多對多關係，透過 `reservations_periods`
- **course_periods** 額外指定該時段使用的 **classroom**（教室） → 多對一關係

---

## 📊 教室管理系統 SQL 查詢需求說明

本文件整理了教室管理系統（G16）常見查詢需求與對應的 SQL 語法，適用於 MariaDB。


### 1️⃣ 查詢教室有哪些

```sql
SELECT id, name, is_active
FROM classrooms;
```

說明：列出所有教室名稱與啟用狀態。

![example](Picture/one.png)

### 2️⃣ 查詢 113-1 有哪些課程

```sql
SELECT id, name, teacher
FROM courses
WHERE academic_year = '113' AND semester = '1';
```

如果學期欄位使用「上、下」文字，請改為：

```sql
SELECT id, name, teacher
FROM courses
WHERE academic_year = '113' AND semester = '上';
```

![example](Picture/two.png)

### 3️⃣ 查詢 113-1 含「程式」的課程

```sql
SELECT id, name, teacher
FROM courses
WHERE academic_year = '113'
  AND semester = '上'
  AND name LIKE '%程式%';
```

說明：篩選學年度為 113、學期為「上」，且課程名稱包含「程式」的課程。

![example](Picture/three.png)

### 4️⃣ 查詢 113 上學期程式課在那些時段上課

```sql
SELECT 
    c.name AS 課程名稱,
    tp.label AS 時段標籤,
    tp.start_time AS 開始時間,
    tp.end_time AS 結束時間
FROM courses c
JOIN course_periods cp ON c.id = cp.course_id
JOIN time_periods tp ON cp.time_period_id = tp.id
WHERE c.academic_year = '113'
  AND c.semester = '上'
  AND c.name LIKE '%程式%';
```

說明：從 `courses`、`course_periods` 和 `time_periods` 表連接查出所有 113-上含「程式」課程的時段安排。

![example](Picture/four.png)


---

## 🔐 身份驗證系統（Auth Service）

---
### 1️⃣ 查詢儲存的用戶資訊

``` 使用 PostgreSQL 資料庫
SELECT * FROM users ORDER BY id ASC; //查看 users 資料表中查詢所有資料
```

說明：從 `users` 這張資料表中，取出所有資料，並依照 `id` 欄位由小到大排序顯示。

![example](Picture/idcheck.png)
