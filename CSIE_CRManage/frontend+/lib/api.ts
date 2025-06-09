// src/lib/api.ts

import { Section } from "lucide-react"

// ✅ 主機 API 網址，可接環境變數
export const CSIE_MANAGE_URL = "http://127.0.0.1:8000"
// export const CSIE_MANAGE_URL = "http://172.20.10.5:8000"
export const API_BASE = `${CSIE_MANAGE_URL}/api`

// ✅ API 路徑集中管理
export const API = {
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

    booking: {
        pending: `${API_BASE}/bookings?status=pending`,
        approve: (id: number) => `${API_BASE}/bookings/${id}/approve`,
        reject: (id: number) => `${API_BASE}/bookings/${id}/reject`,
    },

    user: {
        list: `${API_BASE}/users`,
        promote: (id: number) => `${API_BASE}/users/${id}/promote`,
    },
}
