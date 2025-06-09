// src/lib/api.ts

import { Section } from "lucide-react"

// ✅ 主機 API 網址，可接環境變數
export const CSIE_MANAGE_URL = "http://127.0.0.1:8000"
// export const CSIE_MANAGE_URL = "http://172.20.10.5:8000"
export const API_BASE = `${CSIE_MANAGE_URL}/api`

// ✅ API 路徑集中管理
export const API = {
    auth: {
        login: `${API_BASE}/auth/login`,                     // POST：登入
        verify_token: `${API_BASE}/auth/verify_token`,       // GET：驗證 token
    },

    classroom: {
        get_all_info: `${API_BASE}/classrooms/classroom_info`,
        get_one: (id: string) => `${API_BASE}/classrooms/${id}`,
        create: `${API_BASE}/classrooms`,
        update: (id: string) => `${API_BASE}/classrooms/${id}`,
    },

    section: {
        get_all_info: `${API_BASE}/sections/section_info`,       
        create: `${API_BASE}/sections`,                          
        update: (id: number) => `${API_BASE}/sections/${id}`,    
    },

    course: {
        get_by_classroom: (classroomId: string) => `${API_BASE}/courses/by-classroom/${classroomId}`,
    },


    booking: {
        create: `${API_BASE}/bookings`, // POST 建立預約
        get_by_classroom_date_range: (classroomId: string, startDate: string, endDate: string) =>
            `${API_BASE}/bookings/by-classroom-date-range?classroom_id=${classroomId}&start_date=${startDate}&end_date=${endDate}`,
    },

}
