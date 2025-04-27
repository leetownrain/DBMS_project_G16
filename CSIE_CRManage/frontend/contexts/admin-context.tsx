"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

// 修改變數名稱以避免命名衝突
// 模擬時段資料
const initialTimePeriods = [
  {
    id: "period-1",
    name: "第1節",
    startTime: "08:00",
    endTime: "08:50",
    isActive: true,
    daysAvailable: ["週一", "週二", "週三", "週四", "週五"],
    description: "早上第一節課",
  },
  {
    id: "period-2",
    name: "第2節",
    startTime: "09:00",
    endTime: "09:50",
    isActive: true,
    daysAvailable: ["週一", "週二", "週三", "週四", "週五"],
    description: "早上第二節課",
  },
  {
    id: "period-3",
    name: "第3節",
    startTime: "10:10",
    endTime: "11:00",
    isActive: true,
    daysAvailable: ["週一", "週二", "週三", "週四", "週五"],
    description: "早上第三節課",
  },
  {
    id: "period-4",
    name: "第4節",
    startTime: "11:10",
    endTime: "12:00",
    isActive: true,
    daysAvailable: ["週一", "週二", "週三", "週四", "週五"],
    description: "早上第四節課",
  },
  {
    id: "period-lunch",
    name: "午休",
    startTime: "12:00",
    endTime: "13:10",
    isActive: true,
    daysAvailable: ["週一", "週二", "週三", "週四", "週五"],
    description: "午餐休息時間",
  },
  {
    id: "period-5",
    name: "第5節",
    startTime: "13:20",
    endTime: "14:10",
    isActive: true,
    daysAvailable: ["週一", "週二", "週三", "週四", "週五"],
    description: "下午第一節課",
  },
  {
    id: "period-6",
    name: "第6節",
    startTime: "14:20",
    endTime: "15:10",
    isActive: true,
    daysAvailable: ["週一", "週二", "週三", "週四", "週五"],
    description: "下午第二節課",
  },
  {
    id: "period-7",
    name: "第7節",
    startTime: "15:30",
    endTime: "16:20",
    isActive: true,
    daysAvailable: ["週一", "週二", "週三", "週四", "週五"],
    description: "下午第三節課",
  },
  {
    id: "period-8",
    name: "第8節",
    startTime: "16:30",
    endTime: "17:20",
    isActive: true,
    daysAvailable: ["週一", "週二", "週三", "週四", "週五"],
    description: "下午第四節課",
  },
  {
    id: "period-9",
    name: "第9節",
    startTime: "17:30",
    endTime: "18:20",
    isActive: true,
    daysAvailable: ["週一", "週二", "週三", "週四", "週五"],
    description: "傍晚第一節課",
  },
  {
    id: "period-10",
    name: "第10節",
    startTime: "18:30",
    endTime: "19:20",
    isActive: true,
    daysAvailable: ["週一", "週二", "週三", "週四", "週五"],
    description: "晚上第一節課",
  },
  {
    id: "period-11",
    name: "第11節",
    startTime: "19:30",
    endTime: "20:20",
    isActive: true,
    daysAvailable: ["週一", "週二", "週三", "週四", "週五"],
    description: "晚上第二節課",
  },
  {
    id: "period-12",
    name: "第12節",
    startTime: "20:30",
    endTime: "21:20",
    isActive: true,
    daysAvailable: ["週一", "週二", "週三", "週四", "週五"],
    description: "晚上第三節課",
  },
  {
    id: "period-13",
    name: "第13節",
    startTime: "21:30",
    endTime: "22:20",
    isActive: false,
    daysAvailable: ["週一", "週二", "週三", "週四", "週五"],
    description: "晚上第四節課",
  },
  {
    id: "period-14",
    name: "第14節",
    startTime: "22:30",
    endTime: "23:20",
    isActive: false,
    daysAvailable: ["週一", "週二", "週三", "週四", "週五"],
    description: "晚上第五節課",
  },
]

// 模擬教室資料
const initialClassrooms = [
  {
    id: "a101",
    name: "A101講堂",
    description: "配備多媒體設備的大型講堂",
    location: "A棟, 一樓",
    capacity: 120,
    type: "lecture",
    isActive: true,
  },
  {
    id: "b205",
    name: "B205電腦實驗室",
    description: "30個工作站配備專業軟體",
    location: "B棟, 二樓",
    capacity: 30,
    type: "lab",
    isActive: true,
  },
  {
    id: "c103",
    name: "C103會議室",
    description: "配備視訊會議設備的會議室",
    location: "C棟, 一樓",
    capacity: 20,
    type: "conference",
    isActive: true,
  },
  {
    id: "d201",
    name: "D201研討室",
    description: "中型研討會和工作坊用房間",
    location: "D棟, 二樓",
    capacity: 40,
    type: "seminar",
    isActive: true,
  },
  {
    id: "e105",
    name: "E105工作室",
    description: "藝術和設計專案的創意空間",
    location: "E棟, 一樓",
    capacity: 25,
    type: "studio",
    isActive: true,
  },
  {
    id: "f302",
    name: "F302自習室",
    description: "小型團體學習用房間",
    location: "F棟, 三樓",
    capacity: 8,
    type: "study",
    isActive: false,
  },
]

// 升級請求的模擬資料
const initialUpgradeRequests = [
  {
    id: 1,
    userId: "2",
    userName: "一般使用者",
    email: "user@example.com",
    status: "pending",
    requestedAt: "2025-04-10T10:30:00Z",
    reason: "需要管理部門預約和批准團隊請求。",
  },
  {
    id: 2,
    userId: "3",
    userName: "張小明",
    email: "john@example.com",
    status: "rejected",
    requestedAt: "2025-04-05T08:15:00Z",
    reason: "需要管理員權限來組織學校活動。",
  },
]

// 模擬取消申請資料
const initialCancellationRequests = [
  {
    id: 1,
    bookingId: 101,
    userId: "2",
    userName: "一般使用者",
    email: "user@example.com",
    room: "a101",
    roomName: "A101講堂",
    date: "2025-04-20",
    time: "10:00 - 12:00",
    title: "專案審查",
    reason: "會議已改期至下週",
    status: "pending",
    requestedAt: "2025-04-15T14:30:00Z",
  },
  {
    id: 2,
    bookingId: 102,
    userId: "3",
    userName: "張小明",
    email: "john@example.com",
    room: "c103",
    roomName: "C103會議室",
    date: "2025-04-18",
    time: "14:00 - 15:30",
    title: "部門會議",
    reason: "參與人員有事無法出席",
    status: "pending",
    requestedAt: "2025-04-16T09:15:00Z",
  },
  {
    id: 3,
    bookingId: 103,
    userId: "2",
    userName: "一般使用者",
    email: "user@example.com",
    room: "b205",
    roomName: "B205電腦實驗室",
    date: "2025-04-22",
    time: "13:00 - 15:00",
    title: "程式設計工作坊",
    reason: "講師臨時有事無法出席",
    status: "approved",
    requestedAt: "2025-04-17T11:20:00Z",
    processedAt: "2025-04-17T14:45:00Z",
  },
  {
    id: 4,
    bookingId: 104,
    userId: "3",
    userName: "張小明",
    email: "john@example.com",
    room: "d201",
    roomName: "D201研討室",
    date: "2025-04-19",
    time: "09:00 - 11:00",
    title: "研究小組會議",
    reason: "活動取消",
    status: "rejected",
    requestedAt: "2025-04-16T16:10:00Z",
    processedAt: "2025-04-17T08:30:00Z",
    rejectReason: "取消時間太晚，已無法重新安排其他預約",
  },
]

// 模擬待處理預約
const initialPendingBookings = [
  {
    id: 101,
    room: "a101",
    title: "專案審查",
    date: "2025-04-20",
    start: "10:00",
    end: "12:00",
    requester: {
      name: "王小華",
      email: "sarah@example.com",
    },
  },
  {
    id: 102,
    room: "c103",
    title: "部門會議",
    date: "2025-04-18",
    start: "14:00",
    end: "15:30",
    requester: {
      name: "一般使用者",
      email: "user@example.com",
    },
  },
]

// 定義類型
export type TimePeriod = (typeof initialTimePeriods)[0]
export type Classroom = (typeof initialClassrooms)[0]
export type UpgradeRequest = (typeof initialUpgradeRequests)[0]
export type CancellationRequest = (typeof initialCancellationRequests)[0]
export type PendingBooking = (typeof initialPendingBookings)[0]

// 定義 Context 類型
interface AdminContextType {
  // 資料
  timePeriods: TimePeriod[]
  classrooms: Classroom[]
  upgradeRequests: UpgradeRequest[]
  cancellationRequests: CancellationRequest[]
  pendingBookings: PendingBooking[]

  // 教室管理
  addClassroom: (classroom: Omit<Classroom, "id">) => void
  updateClassroom: (id: string, classroom: Partial<Classroom>) => void
  deleteClassroom: (id: string) => void

  // 時段管理
  addTimePeriod: (timePeriod: Omit<TimePeriod, "id">) => void
  updateTimePeriod: (id: string, timePeriod: Partial<TimePeriod>) => void
  deleteTimePeriod: (id: string) => void

  // 權限請求管理
  approveUpgradeRequest: (id: number) => void
  rejectUpgradeRequest: (id: number) => void

  // 取消申請管理
  approveCancellation: (id: number) => void
  rejectCancellation: (id: number, reason: string) => void

  // 預約管理
  approveBooking: (id: number) => void
  rejectBooking: (id: number) => void
}

// 創建 Context
const AdminContext = createContext<AdminContextType | undefined>(undefined)

// Provider 組件
export function AdminProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const [timePeriods, setTimePeriods] = useState(initialTimePeriods)
  const [classrooms, setClassrooms] = useState(initialClassrooms)
  const [upgradeRequests, setUpgradeRequests] = useState(initialUpgradeRequests)
  const [cancellationRequests, setCancellationRequests] = useState(initialCancellationRequests)
  const [pendingBookings, setPendingBookings] = useState(initialPendingBookings)

  // 教室管理
  const addClassroom = (classroom: Omit<Classroom, "id">) => {
    const newClassroom = {
      ...classroom,
      id: `room-${Date.now()}`,
    }
    setClassrooms((prev) => [...prev, newClassroom])
    toast({
      title: "教室已添加",
      description: "新教室已成功添加到系統中。",
    })
  }

  const updateClassroom = (id: string, classroom: Partial<Classroom>) => {
    setClassrooms((prev) => prev.map((item) => (item.id === id ? { ...item, ...classroom } : item)))
    toast({
      title: "教室已更新",
      description: "教室資訊已成功更新。",
    })
  }

  const deleteClassroom = (id: string) => {
    setClassrooms((prev) => prev.filter((classroom) => classroom.id !== id))
    toast({
      title: "教室已刪除",
      description: "教室已成功從系統中移除。",
    })
  }

  // 時段管理
  const addTimePeriod = (timePeriod: Omit<TimePeriod, "id">) => {
    const newTimePeriod = {
      ...timePeriod,
      id: `period-${Date.now()}`,
    }
    setTimePeriods((prev) => [...prev, newTimePeriod])
    toast({
      title: "時段已添加",
      description: "新時段已成功添加到系統中。",
    })
  }

  const updateTimePeriod = (id: string, timePeriod: Partial<TimePeriod>) => {
    setTimePeriods((prev) => prev.map((item) => (item.id === id ? { ...item, ...timePeriod } : item)))
    toast({
      title: "時段已更新",
      description: "時段資訊已成功更新。",
    })
  }

  const deleteTimePeriod = (id: string) => {
    setTimePeriods((prev) => prev.filter((timePeriod) => timePeriod.id !== id))
    toast({
      title: "時段已刪除",
      description: "時段已成功從系統中移除。",
    })
  }

  // 權限請求管理
  const approveUpgradeRequest = (id: number) => {
    setUpgradeRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: "approved" } : req)))
    toast({
      title: "請求已批准",
      description: "該用戶已獲得管理員權限。",
    })
  }

  const rejectUpgradeRequest = (id: number) => {
    setUpgradeRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: "rejected" } : req)))
    toast({
      title: "請求已拒絕",
      description: "訪問請求已被拒絕。",
    })
  }

  // 取消申請管理
  const approveCancellation = (id: number) => {
    setCancellationRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status: "approved",
              processedAt: new Date().toISOString(),
            }
          : req,
      ),
    )
    toast({
      title: "取消請求已批准",
      description: "預約已成功取消。",
    })
  }

  const rejectCancellation = (id: number, reason: string) => {
    setCancellationRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status: "rejected",
              processedAt: new Date().toISOString(),
              rejectReason: reason,
            }
          : req,
      ),
    )
    toast({
      title: "取消請求已拒絕",
      description: "預約取消請求已被拒絕。",
    })
  }

  // 預約管理
  const approveBooking = (id: number) => {
    // 在實際應用中，這裡會更新預約狀態
    // 為了演示，我們只顯示一個通知
    toast({
      title: "預約已批准",
      description: `預約 #${id} 已獲批准。`,
    })
  }

  const rejectBooking = (id: number) => {
    // 在實際應用中，這裡會更新預約狀態
    // 為了演示，我們只顯示一個通知
    toast({
      title: "預約已拒絕",
      description: `預約 #${id} 已被拒絕。`,
    })
  }

  return (
    <AdminContext.Provider
      value={{
        timePeriods,
        classrooms,
        upgradeRequests,
        cancellationRequests,
        pendingBookings,
        addClassroom,
        updateClassroom,
        deleteClassroom,
        addTimePeriod,
        updateTimePeriod,
        deleteTimePeriod,
        approveUpgradeRequest,
        rejectUpgradeRequest,
        approveCancellation,
        rejectCancellation,
        approveBooking,
        rejectBooking,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

// 自定義 Hook
export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
