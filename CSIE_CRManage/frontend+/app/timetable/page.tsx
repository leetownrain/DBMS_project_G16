"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Info, CalendarIcon, Clock, User, FileText } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth/auth-provider"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 時段資料
const timeSlots = [
  { id: 1, name: "第一節", time: "08:00-09:00" },
  { id: 2, name: "第二節", time: "09:00-10:00" },
  { id: 3, name: "第三節", time: "10:00-11:00" },
  { id: 4, name: "第四節", time: "11:00-12:00" },
  { id: 5, name: "中午", time: "12:00-13:00" },
  { id: 6, name: "第五節", time: "13:00-14:00" },
  { id: 7, name: "第六節", time: "14:00-15:00" },
  { id: 8, name: "第七節", time: "15:00-16:00" },
  { id: 9, name: "第八節", time: "16:00-17:00" },
  { id: 10, name: "第九節", time: "17:00-18:00" },
  { id: 11, name: "第十節", time: "18:00-19:00" },
  { id: 12, name: "第十一節", time: "19:00-20:00" },
  { id: 13, name: "第十二節", time: "20:00-21:00" },
  { id: 14, name: "第十三節", time: "21:00-22:00" },
  { id: 15, name: "第十四節", time: "22:00-23:00" },
]

// 教室資料
const classrooms = [
  { id: "301", name: "301教室", capacity: 40, equipment: "投影機, 音響系統, 電腦" },
  { id: "302", name: "302教室", capacity: 30, equipment: "投影機, 白板" },
  { id: "303", name: "303教室", capacity: 30, equipment: "投影機, 白板" },
  { id: "401", name: "401教室", capacity: 50, equipment: "投影機, 電腦, 網路設備" },
  { id: "402", name: "402教室", capacity: 25, equipment: "實驗設備, 投影機" },
  { id: "501", name: "501教室", capacity: 60, equipment: "投影機, 音響系統, 電腦, 視訊會議設備" },
]

// 模擬課程資料（上課用）
const courseData = {
  "301-0": { courseName: "程式設計", teacher: "王教授", time: "08:00-09:00" },
  "301-1": { courseName: "資料結構", teacher: "李教授", time: "09:00-10:00" },
  "302-2": { courseName: "計算機概論", teacher: "張教授", time: "10:00-11:00" },
  "401-3": { courseName: "網路安全", teacher: "陳教授", time: "11:00-12:00" },
  "402-5": { courseName: "人工智慧", teacher: "林教授", time: "13:00-14:00" },
  "501-6": { courseName: "資料庫系統", teacher: "黃教授", time: "14:00-15:00" },
  "303-7": { courseName: "軟體工程", teacher: "吳教授", time: "15:00-16:00" },
  "401-8": { courseName: "作業系統", teacher: "趙教授", time: "16:00-17:00" },
}

// 模擬預約資料（已預約）
const bookingData = {
  "301-7": { user: "王小明", reason: "專題討論會議", professor: "吳教授", time: "15:00-16:00" },
  "302-4": { user: "李小華", reason: "學生社團活動", professor: "趙教授", time: "12:00-13:00" },
  "302-8": { user: "張小龍", reason: "研究生論文口試", professor: "孫教授", time: "16:00-17:00" },
  "401-9": { user: "陳小美", reason: "實驗室會議", professor: "周教授", time: "17:00-18:00" },
  "402-1": { user: "林小強", reason: "期末專題報告", professor: "錢教授", time: "09:00-10:00" },
  "501-10": { user: "黃小芳", reason: "國際視訊會議", professor: "鄭教授", time: "18:00-19:00" },
  "303-3": { user: "劉小美", reason: "畢業論文答辯", professor: "馬教授", time: "11:00-12:00" },
  "402-11": { user: "徐小強", reason: "研究討論會", professor: "朱教授", time: "19:00-20:00" },
}

// 生成時段狀態 - 只有三種狀態：course, booked, available
const generateSlotStatus = (date: Date, classroomId: string, slotIndex: number) => {
  const courseKey = `${classroomId}-${slotIndex}`
  const bookingKey = `${classroomId}-${slotIndex}`

  // 檢查是否有課程
  if (courseData[courseKey as keyof typeof courseData]) {
    return { status: "course", data: courseData[courseKey as keyof typeof courseData] }
  }

  // 檢查是否有預約
  if (bookingData[bookingKey as keyof typeof bookingData]) {
    return { status: "booked", data: bookingData[bookingKey as keyof typeof bookingData] }
  }

  // 其餘時段都是可預約
  return { status: "available", data: null }
}

export default function TimetablePage() {
  const { isAuthenticated, userName } = useAuth()
  const [date, setDate] = useState<Date>(new Date())
  const [viewMode, setViewMode] = useState<"table" | "list">("table")
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<{
    classroom: string
    timeSlot: string
    timeRange: string
    date: Date
  } | null>(null)
  const [bookingForm, setBookingForm] = useState({
    startTimeSlot: "",
    endTimeSlot: "",
    applicantName: "",
    studentId: "",
    phone: "",
    email: "",
    department: "",
    supervisor: "",
    reason: "",
  })

  const handleBookingClick = (status: string, classroom: any, timeSlot: any) => {
    if (status !== "available") {
      return
    }

    if (!isAuthenticated) {
      alert("請先登入以預約教室")
      return
    }

    // 設定選中的預約資訊
    setSelectedBooking({
      classroom: classroom.name,
      timeSlot: timeSlot.name,
      timeRange: timeSlot.time,
      date: date,
    })

    // 重置表單
    setBookingForm({
      startTimeSlot: timeSlot.name,
      endTimeSlot: timeSlot.name,
      applicantName: "",
      studentId: "",
      phone: "",
      email: "",
      department: "",
      supervisor: "",
      reason: "",
    })

    // 開啟預約對話框
    setIsBookingDialogOpen(true)
  }

  const handleSubmitBooking = () => {
    // 驗證表單
    if (!selectedBooking?.classroom) {
      alert("請選擇借用教室")
      return
    }
    if (!bookingForm.startTimeSlot) {
      alert("請選擇開始時段")
      return
    }
    if (!bookingForm.endTimeSlot) {
      alert("請選擇結束時段")
      return
    }
    if (!bookingForm.applicantName.trim()) {
      alert("請填寫申請人姓名")
      return
    }
    if (!bookingForm.studentId.trim()) {
      alert("請填寫學號")
      return
    }
    if (!bookingForm.phone.trim()) {
      alert("請填寫電話")
      return
    }
    if (!bookingForm.email.trim()) {
      alert("請填寫Email")
      return
    }
    if (!bookingForm.department.trim()) {
      alert("請填寫借用單位")
      return
    }
    if (!bookingForm.supervisor.trim()) {
      alert("請填寫指導老師")
      return
    }
    if (!bookingForm.reason.trim()) {
      alert("請填寫借用事由")
      return
    }

    // 模擬提交預約
    console.log("提交預約:", {
      ...selectedBooking,
      ...bookingForm,
      user: userName,
    })

    alert("預約申請已提交，等待審核")
    setIsBookingDialogOpen(false)
  }

  const renderTimeSlotCell = (classroom: any, slot: any, index: number) => {
    const slotInfo = generateSlotStatus(date, classroom.id, index)

    switch (slotInfo.status) {
      case "course":
        // 上課用
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full h-12 flex items-center justify-center bg-blue-100 text-blue-800 cursor-help">
                  上課用
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <div className="space-y-1">
                  <p className="font-medium">課程資訊</p>
                  <p className="text-sm">課程名稱：{slotInfo.data.courseName}</p>
                  <p className="text-sm">授課教師：{slotInfo.data.teacher}</p>
                  <p className="text-sm">時間：{slotInfo.data.time}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )

      case "booked":
        // 已預約
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full h-12 flex items-center justify-center bg-red-100 text-red-800 cursor-help">
                  已預約
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <div className="space-y-1">
                  <p className="font-medium">預約資訊</p>
                  <p className="text-sm">預約人：{slotInfo.data?.user || "未知"}</p>
                  <p className="text-sm">預約理由：{slotInfo.data?.reason || "未提供"}</p>
                  <p className="text-sm">預約教授：{slotInfo.data?.professor || "未指定"}</p>
                  <p className="text-sm">時間：{slotInfo.data?.time || "未知"}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )

      case "available":
      default:
        // 可預約
        return (
          <div
            className="w-full h-12 flex items-center justify-center bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer"
            title="可預約"
            onClick={() => handleBookingClick(slotInfo.status, classroom, slot)}
          >
            可預約
          </div>
        )
    }
  }

  const renderListViewSlot = (classroom: any, slot: any, index: number) => {
    const slotInfo = generateSlotStatus(date, classroom.id, index)

    switch (slotInfo.status) {
      case "course":
        // 上課用
        return (
          <TooltipProvider key={`${classroom.id}-${index}`}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-2 text-center rounded-md bg-blue-100 text-blue-800 cursor-help">
                  <div className="text-sm font-medium">{slot.name}</div>
                  <div className="text-xs mt-1">上課用</div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <div className="space-y-1">
                  <p className="font-medium">課程資訊</p>
                  <p className="text-sm">課程名稱：{slotInfo.data.courseName}</p>
                  <p className="text-sm">授課教師：{slotInfo.data.teacher}</p>
                  <p className="text-sm">時間：{slotInfo.data.time}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )

      case "booked":
        // 已預約
        return (
          <TooltipProvider key={`${classroom.id}-${index}`}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-2 text-center rounded-md bg-red-100 text-red-800 cursor-help">
                  <div className="text-sm font-medium">{slot.name}</div>
                  <div className="text-xs mt-1">已預約</div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <div className="space-y-1">
                  <p className="font-medium">預約資訊</p>
                  <p className="text-sm">預約人：{slotInfo.data?.user || "未知"}</p>
                  <p className="text-sm">預約理由：{slotInfo.data?.reason || "未提供"}</p>
                  <p className="text-sm">預約教授：{slotInfo.data?.professor || "未指定"}</p>
                  <p className="text-sm">時間：{slotInfo.data?.time || "未知"}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )

      case "available":
      default:
        // 可預約
        return (
          <div
            key={`${classroom.id}-${index}`}
            className="p-2 text-center rounded-md bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer"
            onClick={() => handleBookingClick(slotInfo.status, classroom, slot)}
          >
            <div className="text-sm font-medium">{slot.name}</div>
            <div className="text-xs mt-1">可預約</div>
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container px-4 py-8 mx-auto md:px-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">教室時段表</h1>
            <p className="text-muted-foreground">查看各教室可預約時段，登入後即可申請預約</p>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="space-y-1 w-full md:w-48">
              <label className="text-sm font-medium">日期</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={format(date, "yyyy-MM-dd")}
                  onChange={(e) => {
                    if (e.target.value) {
                      setDate(new Date(e.target.value))
                    }
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <Tabs
              defaultValue="table"
              className="w-full md:w-auto"
              onValueChange={(v) => setViewMode(v as "table" | "list")}
            >
              <TabsList>
                <TabsTrigger value="table">表格檢視</TabsTrigger>
                <TabsTrigger value="list">列表檢視</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>教室時段表 ({format(date, "yyyy/MM/dd")})</CardTitle>
              <CardDescription>
                <div className="flex items-center gap-2 mt-1">
                  <Info className="w-4 h-4" />
                  <span>綠色表示可預約，紅色表示已預約，藍色表示上課用（懸停查看詳細資訊）</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {viewMode === "table" ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px]">教室</TableHead>
                        {timeSlots.map((slot) => (
                          <TableHead key={slot.id} className="text-center">
                            {slot.name}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {classrooms.map((classroom) => (
                        <TableRow key={classroom.id}>
                          <TableCell className="font-medium">
                            <div>{classroom.name}</div>
                            <div className="text-xs text-muted-foreground">容納 {classroom.capacity} 人</div>
                          </TableCell>
                          {timeSlots.map((slot, index) => (
                            <TableCell key={`${classroom.id}-${index}`} className="text-center p-0">
                              {renderTimeSlotCell(classroom, slot, index)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="space-y-4">
                  {classrooms.map((classroom) => (
                    <Card key={classroom.id}>
                      <CardHeader>
                        <CardTitle>{classroom.name}</CardTitle>
                        <CardDescription>
                          容納 {classroom.capacity} 人<div className="mt-1 text-xs">設備: {classroom.equipment}</div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-5">
                          {timeSlots.map((slot, index) => renderListViewSlot(classroom, slot, index))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {!isAuthenticated && (
            <div className="flex justify-center mt-4">
              <Link href="/login">
                <Button size="lg">登入以預約教室</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* 預約對話框 */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              教室預約申請
            </DialogTitle>
            <DialogDescription>請填寫以下資訊申請教室預約</DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6">
              {/* 上段：借用教室、借用時間、開始時段和結束時段 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">預約資訊</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="classroom">借用教室 *</Label>
                    <Select
                      value={selectedBooking.classroom}
                      onValueChange={(value) =>
                        setSelectedBooking((prev) => (prev ? { ...prev, classroom: value } : null))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="選擇教室" />
                      </SelectTrigger>
                      <SelectContent>
                        {classrooms.map((classroom) => (
                          <SelectItem key={classroom.id} value={classroom.name}>
                            {classroom.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">借用時間 *</Label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        value={format(selectedBooking.date, "yyyy-MM-dd")}
                        onChange={(e) => {
                          if (e.target.value) {
                            setSelectedBooking((prev) => (prev ? { ...prev, date: new Date(e.target.value) } : null))
                          }
                        }}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTimeSlot">開始時段 *</Label>
                    <Select
                      value={bookingForm.startTimeSlot}
                      onValueChange={(value) => setBookingForm((prev) => ({ ...prev, startTimeSlot: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="選擇開始時段" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot.id} value={slot.name}>
                            {slot.name} ({slot.time})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTimeSlot">結束時段 *</Label>
                    <Select
                      value={bookingForm.endTimeSlot}
                      onValueChange={(value) => setBookingForm((prev) => ({ ...prev, endTimeSlot: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="選擇結束時段" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots
                          .filter(
                            (slot) =>
                              !bookingForm.startTimeSlot ||
                              timeSlots.findIndex((s) => s.name === bookingForm.startTimeSlot) <=
                                timeSlots.findIndex((s) => s.name === slot.name),
                          )
                          .map((slot) => (
                            <SelectItem key={slot.id} value={slot.name}>
                              {slot.name} ({slot.time})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* 中段：申請人、學號、電話和email */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">申請人資料</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="applicantName" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      申請人 *
                    </Label>
                    <Input
                      id="applicantName"
                      placeholder="請輸入姓名"
                      value={bookingForm.applicantName}
                      onChange={(e) => setBookingForm((prev) => ({ ...prev, applicantName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studentId">學號 *</Label>
                    <Input
                      id="studentId"
                      placeholder="請輸入學號"
                      value={bookingForm.studentId}
                      onChange={(e) => setBookingForm((prev) => ({ ...prev, studentId: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">電話 *</Label>
                    <Input
                      id="phone"
                      placeholder="請輸入聯絡電話"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm((prev) => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="請輸入電子郵件"
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm((prev) => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 下段：借用單位、指導老師和借用事由 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">借用資訊</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">借用單位 *</Label>
                    <Input
                      id="department"
                      placeholder="請輸入系所或單位名稱"
                      value={bookingForm.department}
                      onChange={(e) => setBookingForm((prev) => ({ ...prev, department: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supervisor">指導老師 *</Label>
                    <Input
                      id="supervisor"
                      placeholder="請輸入指導老師姓名"
                      value={bookingForm.supervisor}
                      onChange={(e) => setBookingForm((prev) => ({ ...prev, supervisor: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    借用事由 *
                  </Label>
                  <Input
                    id="reason"
                    placeholder="例如：專題討論、研究會議等"
                    value={bookingForm.reason}
                    onChange={(e) => setBookingForm((prev) => ({ ...prev, reason: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSubmitBooking}>提交申請</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
