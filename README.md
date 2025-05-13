# 教室管理系統（G16）

## 🧩 系統簡介

這個期末專題為一套具備「使用者身份驗證」與「教室借用管理」功能的 Web 應用系統，整體設計以模組化方式拆分為兩大子系統：

- **身份驗證系統（Auth Service）**：獨立的使用者登入、註冊、驗證模組，可與多個服務串接。
- **教室借用系統（Classroom Booking System）**：提供教室借用申請、審核與時段排程功能，並與 Auth Service 整合以確保操作權限。

---

## 👨‍💻 專案作者

| 姓名 | 學號 | 班級 |
|------|------|------|
| 吳哲瑋 | 41143213 | 四資工三乙 |
| 李鎮宇 | 41143216 | 四資工三乙 |
| 林致均 | 41143222 | 四資工三乙 |
| 陳亮祐 | 41143235 | 四資工三乙 |

---

## 🌐 應用情境（使用說明）

在系上管理的教室，每天都有借用需求。除了課表已固定的教室外，還有許多由個人申請的借用需求。過去，這些申請通常是透過紙本方式進行，如今系上已經有一個線上借用系統，這大大提高了借用的便利性。然而，該系統在使用上仍存在一些不便之處。因此，我們希望重新設計一個符合當前需求的新系統。

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

![教室管理系統 ER 圖](Picture\full_erd.png)


---

## 📎 作業連結

### 作業一：🔗 [前往作業一連結](https://www.canva.com/design/DAGj9WScB2c/AUaKssZWl7kdMSSYxcPwuw/edit?utm_content=DAGj9WScB2c&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

### 作業二：🔗 [前往作業二連結](https://www.canva.com/design/DAGmr2V3CzA/0mnUy8ykieZKFDUyV-0oBQ/edit?utm_content=DAGmr2V3CzA&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

---


## 🔷 一、實體資料表（Entities）

### 1. `users` – 使用者資料表

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'user'))
);
```

| 欄位名稱 | 資料型別 | 中文說明 | 完整性限制 |
|----------|-------------|----------|--------------|
| `id`     | INTEGER      | 使用者編號 | 主鍵，自動產生 |
| `name`   | VARCHAR(100) | 使用者姓名 | NOT NULL |
| `email`  | VARCHAR(100) | 電子郵件 | NOT NULL, UNIQUE |
| `role`   | VARCHAR(50)  | 使用者角色 | NOT NULL, 僅限 'admin' 或 'user' |

---

### 2. `classrooms` – 教室資料表

```sql
CREATE TABLE classrooms (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);
```

| 欄位名稱 | 資料型別 | 中文說明 | 完整性限制 |
|----------|-------------|----------|--------------|
| `id`         | INTEGER      | 教室編號 | 主鍵，自動產生 |
| `name`       | VARCHAR(100) | 教室名稱 | NOT NULL |
| `is_active`  | BOOLEAN      | 是否啟用 | 預設為 TRUE |

---

### 3. `courses` – 課程資料表

```sql
CREATE TABLE courses (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) NOT NULL,
    teacher VARCHAR(100) NOT NULL,
    academic_year VARCHAR(20) NOT NULL CHECK (academic_year ~ '^[0-9]{4}$'),
    semester VARCHAR(10) NOT NULL CHECK (semester IN ('上', '下'))
);
```

| 欄位名稱 | 資料型別 | 中文說明 | 完整性限制 |
|----------|-------------|----------|--------------|
| `id`            | INTEGER       | 課程編號 | 主鍵，自動產生 |
| `name`          | VARCHAR(100)  | 課程名稱 | NOT NULL |
| `teacher`       | VARCHAR(100)  | 授課教師姓名 | NOT NULL |
| `academic_year` | VARCHAR(20)   | 學年度 | NOT NULL, 格式為 4 位數 |
| `semester`      | VARCHAR(10)   | 學期 | NOT NULL, 僅限 '上' 或 '下' |

---

### 4. `time_periods` – 時段資料表

```sql
CREATE TABLE time_periods (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    label VARCHAR(50) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    CHECK (start_time < end_time)
);
```

| 欄位名稱 | 資料型別 | 中文說明 | 完整性限制 |
|----------|-------------|----------|--------------|
| `id`         | INTEGER      | 時段編號 | 主鍵，自動產生 |
| `label`      | VARCHAR(50)  | 時段標籤 | NOT NULL |
| `start_time` | TIME         | 開始時間 | NOT NULL |
| `end_time`   | TIME         | 結束時間 | NOT NULL，必須晚於開始時間 |

---

### 5. `reservations` – 教室借用申請表

```sql
CREATE TABLE reservations (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    date DATE NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
    unit VARCHAR(100) NOT NULL,
    teacher VARCHAR(100) NOT NULL,
    applicant_id INTEGER NOT NULL,
    applicant_name VARCHAR(100) NOT NULL,
    applicant_email VARCHAR(100) NOT NULL CHECK (applicant_email LIKE '%@%'),
    applicant_phone VARCHAR(50) NOT NULL,
    classroom_id INTEGER NOT NULL REFERENCES classrooms(id)
);
```

| 欄位名稱 | 資料型別 | 中文說明 | 完整性限制 |
|----------|--------------|----------|--------------|
| `id`              | INTEGER       | 借用紀錄編號 | 主鍵，自動產生 |
| `date`            | DATE          | 借用日期 | NOT NULL |
| `reason`          | TEXT          | 借用原因 | NOT NULL |
| `status`          | VARCHAR(50)   | 借用狀態 | NOT NULL, 限定值 |
| `unit`            | VARCHAR(100)  | 申請單位 | NOT NULL |
| `teacher`         | VARCHAR(100)  | 指導老師 | NOT NULL |
| `applicant_id`    | INTEGER       | 申請人 ID | NOT NULL |
| `applicant_name`  | VARCHAR(100)  | 申請人姓名 | NOT NULL |
| `applicant_email` | VARCHAR(100)  | 申請人信箱 | NOT NULL, Email 格式 |
| `applicant_phone` | VARCHAR(50)   | 申請人電話 | NOT NULL |
| `classroom_id`    | INTEGER       | 教室 ID | 外鍵 |

**外鍵說明：**
- `classroom_id` → `classrooms(id)`

---

## 🔶 二、關係資料表（Relationships）

### 1. `course_periods` – 課程 × 時段 × 教室 的中介表

```sql
CREATE TABLE course_periods (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    time_period_id INTEGER NOT NULL REFERENCES time_periods(id) ON DELETE CASCADE,
    classroom_id INTEGER REFERENCES classrooms(id) ON DELETE SET NULL
);
```

| 欄位名稱 | 資料型別 | 中文說明 | 完整性限制 |
|----------|--------------|----------|--------------|
| `id`            | INTEGER | 編號 | 主鍵，自動產生 |
| `course_id`     | INTEGER | 課程 ID | NOT NULL, 外鍵 |
| `time_period_id`| INTEGER | 時段 ID | NOT NULL, 外鍵 |
| `classroom_id`  | INTEGER | 教室 ID | 可為空, 外鍵 |

**外鍵說明：**
- `course_id` → `courses(id)`  
- `time_period_id` → `time_periods(id)`  
- `classroom_id` → `classrooms(id)`

---

### 2. `reservations_periods` – 借用申請 × 時段 的中介表

```sql
CREATE TABLE reservations_periods (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    reservation_id INTEGER NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    time_period_id INTEGER NOT NULL REFERENCES time_periods(id) ON DELETE CASCADE
);
```

| 欄位名稱 | 資料型別 | 中文說明 | 完整性限制 |
|----------|--------------|----------|--------------|
| `id`              | INTEGER | 編號 | 主鍵，自動產生 |
| `reservation_id`  | INTEGER | 借用申請 ID | NOT NULL, 外鍵 |
| `time_period_id`  | INTEGER | 時段 ID | NOT NULL, 外鍵 |

**外鍵說明：**
- `reservation_id` → `reservations(id)`  
- `time_period_id` → `time_periods(id)`

---

## 📌 關係整理與解釋

![教室管理系統 ER 圖](Picture\rela_erd.png)

- 一筆 **reservation**（借用）對應一間 **classroom**（教室）→ 多對一關係
- 一門 **course**（課程）可對應多個 **time_period**（時段）→ 多對多關係，透過 `course_periods`
- 一筆 **reservation** 可對應多個 **time_period** → 多對多關係，透過 `reservations_periods`
- **course_periods** 額外指定該時段使用的 **classroom**（教室） → 多對一關係
