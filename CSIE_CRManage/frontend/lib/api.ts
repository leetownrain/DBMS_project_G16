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
        post_create_new_data: `${API_BASE}/classrooms/add_classroom`,
        put_update_info: (id: string) => `${API_BASE}/classrooms/update_classroom/${id}`,
        delete: (id: string) => `${API_BASE}/classrooms/${id}`,
    },

    section: {
        get_all_info: `${API_BASE}/sections/section_info`,
        create: `${API_BASE}/time-periods`,
        update: (id: string) => `${API_BASE}/time-periods/${id}`,
        delete: (id: string) => `${API_BASE}/time-periods/${id}`,
    },

    booking: {
        pending: `${API_BASE}/bookings?status=pending`,
        approve: (id: number) => `${API_BASE}/bookings/${id}/approve`,
        reject: (id: number) => `${API_BASE}/bookings/${id}/reject`,
    },

    cancelRequest: {
        list: `${API_BASE}/cancellation-requests`,
        approve: (id: number) => `${API_BASE}/cancellation-requests/${id}/approve`,
        reject: (id: number) => `${API_BASE}/cancellation-requests/${id}/reject`,
    },

    upgradeRequest: {
        list: `${API_BASE}/upgrade-requests`,
        approve: (id: number) => `${API_BASE}/upgrade-requests/${id}/approve`,
        reject: (id: number) => `${API_BASE}/upgrade-requests/${id}/reject`,
    },

    user: {
        list: `${API_BASE}/users`,
        promote: (id: number) => `${API_BASE}/users/${id}/promote`,
    },
}
