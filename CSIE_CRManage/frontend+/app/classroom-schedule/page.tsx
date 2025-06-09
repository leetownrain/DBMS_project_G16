"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Info, CalendarIcon, BookOpen, Clock, User, FileText } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { format, addDays, startOfWeek } from "date-fns"
import { zhTW } from "date-fns/locale"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { API } from "@/lib/api" // ✅ 加入這行

interface Classroom {
  id: string
  name: string
  capacity: number
  isActive: boolean
}

interface TimeSlot {
  id: number
  label: string
  start_time: string
  end_time: string
}

interface CourseSlot {
  course_name: string
  teacher: string
  day_of_week: number
  section: string
}

interface BookingSlot {
  date: string
  classroom: string
  section: string
  applicant: string
  reason: string
  day_of_week: number
}

// 模擬預約資料
// const bookings = [
//   { id: 1, classroom: "301", day: 1, slot: 3, purpose: "小組討論", user: "學生A" },
//   { id: 2, classroom: "301", day: 2, slot: 5, purpose: "午休活動", user: "學生B" },
//   { id: 3, classroom: "301", day: 3, slot: 4, purpose: "專題會議", user: "學生C" },
//   { id: 4, classroom: "301", day: 5, slot: 8, purpose: "社團活動", user: "學生D" },
//   { id: 5, classroom: "302", day: 2, slot: 1, purpose: "讀書會", user: "學生E" },
//   { id: 6, classroom: "302", day: 4, slot: 6, purpose: "演講準備", user: "學生F" },
// ]



// 檢查時段是否被預約
// const isSlotBooked = (classroom: string, day: number, slot: number) => {
//   return bookings.some((booking) => booking.classroom === classroom && booking.day === day && booking.slot === slot)
// }

export default function ClassroomSchedulePage() {
  const { isAuthenticated, userName } = useAuth()
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [selectedClassroom, setSelectedClassroom] = useState<string>("")
  const [courseSlots, setCourseSlots] = useState<CourseSlot[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [bookingSlots, setBookingSlots] = useState<BookingSlot[]>([])
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({ start: new Date(), end: new Date() })  
  const [weekStartDate, setWeekStartDate] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
  const [selectedBookingInfo, setSelectedBookingInfo] = useState<{
    classroom: string
    date: Date
    dayNumber: number
    slotId: number
    slotName: string
    slotTime: string
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
    classroom_id: "",
  })

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const res = await fetch(API.classroom.get_all_info)
        if (!res.ok) throw new Error("無法取得教室資料")
        const data = await res.json()
        setClassrooms(data)
        if (data.length > 0) {
          setSelectedClassroom(data[0].id)
        }
      } catch (error) {
        console.error("載入教室失敗：", error)
      }
    }
    fetchClassrooms()
  }, [])

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const res = await fetch(API.section.get_all_info)
        if (!res.ok) throw new Error("無法取得時段資料")
        const data = await res.json()
        const mapped = data.map((s: any) => ({
          id: s.id,
          label: s.label,
          start_time: s.start_time.slice(0, 5),
          end_time: s.end_time.slice(0, 5),
        }))
        setTimeSlots(mapped)
      } catch (error) {
        console.error("載入時段失敗：", error)
      }
    }
    fetchTimeSlots()
  }, [])

  useEffect(() => {
    if (!selectedClassroom) return

    const fetchCourseSlots = async () => {
      try {
        const res = await fetch(API.course.get_by_classroom(selectedClassroom))
        if (!res.ok) throw new Error("無法取得課程資料")
        const data = await res.json()
        setCourseSlots(data)
      } catch (error) {
        console.error("載入課程失敗：", error)
      }
    }

    fetchCourseSlots()
  }, [selectedClassroom])

  useEffect(() => {
    if (selectedClassroom && dateRange.start && dateRange.end) {
      fetchBookings()
    }
  }, [selectedClassroom, dateRange])

  useEffect(() => {
    const start = weekStartDate
    const end = addDays(weekStartDate, 6)
    setDateRange({ start, end })
  }, [weekStartDate])

  const fetchBookings = async () => {
    try {
      if (!selectedClassroom || !dateRange.start || !dateRange.end) return

      const startDate = format(dateRange.start, "yyyy-MM-dd")
      const endDate = format(addDays(dateRange.start, 6), "yyyy-MM-dd")

      const url = API.booking.get_by_classroom_date_range(
        selectedClassroom,
        startDate,
        endDate
      )

      const res = await fetch(url)
      if (!res.ok) throw new Error("無法取得預約資料")

      let data = await res.json()

      // ✅ 補上 day_of_week (1 = Monday, 7 = Sunday)
      data = data.map((item: any) => {
        const dayOfWeek = new Date(item.date).getDay()
        return {
          ...item,
          day_of_week: dayOfWeek === 0 ? 7 : dayOfWeek,
        }
      })

      setBookingSlots(data)
    } catch (err) {
      console.error("載入預約資料失敗：", err)
    }
  }


  // 檢查時段是否被課程佔用
  const isSlotOccupiedByCourse = (day: number, slot: number) => {
    const sectionLabel = timeSlots.find((t) => t.id === slot)?.label
    return courseSlots.some((c) => c.day_of_week === day && c.section === sectionLabel)
  }

  const isSlotBooked = (day: number, slot: number) => {
    const sectionLabel = timeSlots.find((t) => t.id === slot)?.label
    return bookingSlots.some((b) => b.day_of_week === day && b.section === sectionLabel)
  }


  // 獲取佔用時段的課程或預約信息
  // ⏩ 修改為可查詢預約資訊
  const getSlotInfo = (day: number, slot: number) => {
    const sectionLabel = timeSlots.find((t) => t.id === slot)?.label

    const courseMatch = courseSlots.find(
      (c) => c.day_of_week === day && c.section === sectionLabel
    )
    if (courseMatch) {
      return { type: "course", name: courseMatch.course_name, teacher: courseMatch.teacher }
    }

    const bookingMatch = bookingSlots.find(
      (b) => b.day_of_week === day && b.section === sectionLabel
    )
    if (bookingMatch) {
      return { type: "booking", name: bookingMatch.reason, teacher: bookingMatch.applicant }
    }

    return null
  }

  // 生成一周的日期
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStartDate, i)
    return {
      date,
      dayName: format(date, "EEEE", { locale: zhTW }),
      dayShort: format(date, "MM/dd"),
      dayNumber: i + 1, // 1 = 星期一, 7 = 星期日
    }
  })

  const handleBooking = (day: number, slot: number) => {
    if (!isAuthenticated) {
      alert("請先登入以預約教室")
      return
    }

    const dayInfo = weekDays[day - 1]
    const slotInfo = timeSlots[slot - 1]

    // 設定選中的預約資訊
    setSelectedBookingInfo({
      classroom: classrooms.find((c) => c.id === selectedClassroom)?.name || "",
      date: dayInfo.date,
      dayNumber: day,
      slotId: slot,
      slotName: slotInfo.label,
      slotTime: slotInfo.start_time + "-" + slotInfo.end_time,
    })

    // 重置表單
    setBookingForm({
      startTimeSlot: slotInfo.label,
      endTimeSlot: slotInfo.label,
      applicantName: userName || "",
      studentId: "",
      phone: "",
      email: "",
      department: "",
      supervisor: "",
      reason: "",
      classroom_id: selectedClassroom,
    })

    // 開啟預約對話框
    setIsBookingDialogOpen(true)
  }

  const handleSubmitBooking = async () => {
    // 驗證表單
    if (!selectedBookingInfo?.classroom) {
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

    const startIdx = timeSlots.findIndex((s) => s.label === bookingForm.startTimeSlot)
    const endIdx = timeSlots.findIndex((s) => s.label === bookingForm.endTimeSlot)
    const section_ids = timeSlots.slice(startIdx, endIdx + 1).map((s) => s.id)

    const payload = {
      applicant_id: bookingForm.studentId,
      applicant_name: bookingForm.applicantName,
      applicant_email: bookingForm.email,
      applicant_phone: bookingForm.phone,
      unit: bookingForm.department,
      teacher: bookingForm.supervisor,
      reason: bookingForm.reason,
      date: format(selectedBookingInfo.date, "yyyy-MM-dd"),
      classroom_id: bookingForm.classroom_id,
      section_ids,
    }

    try {
      const res = await fetch(API.booking.create, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("預約失敗")

      alert("預約成功")
      setIsBookingDialogOpen(false)
      setBookingForm({
        startTimeSlot: "",
        endTimeSlot: "",
        applicantName: userName || "",
        studentId: "",
        phone: "",
        email: "",
        department: "",
        supervisor: "",
        reason: "",
        classroom_id: selectedClassroom,
      })
      await fetchBookings()
    } catch (err) {
      console.error("送出失敗：", err)
      alert("提交失敗")
    }
  }


  const handleWeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const selectedDate = new Date(e.target.value)
      setWeekStartDate(startOfWeek(selectedDate, { weekStartsOn: 1 }))
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container px-4 py-8 mx-auto md:px-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">教室課程表</h1>
            <p className="text-muted-foreground">查看教室一週的使用狀況，包含課程和預約</p>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="space-y-1 w-full md:w-48">
              <label className="text-sm font-medium">選擇教室</label>
              <Select value={selectedClassroom} onValueChange={setSelectedClassroom}>
                <SelectTrigger>
                  <SelectValue placeholder="選擇教室" />
                </SelectTrigger>
                <SelectContent>
                  {classrooms.map((classroom) => (
                    <SelectItem key={classroom.id} value={classroom.id}>
                      {classroom.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1 w-full md:w-48">
              <label className="text-sm font-medium">選擇週次</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={format(weekStartDate, "yyyy-MM-dd")}
                  onChange={handleWeekChange}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {classrooms.find((c) => c.id === selectedClassroom)?.name} ({format(weekStartDate, "yyyy/MM/dd")}{" "}
                ~ {format(addDays(weekStartDate, 6), "yyyy/MM/dd")})
              </CardTitle>
              <CardDescription>
                <div className="flex items-center gap-2 mt-1">
                  <Info className="w-4 h-4" />
                  <span>藍色表示課程，紅色表示已預約，綠色表示可預約</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">節次</TableHead>
                      {weekDays.map((day) => (
                        <TableHead key={day.dayNumber} className="text-center">
                          <div>{day.dayName}</div>
                          <div className="text-xs font-normal">{day.dayShort}</div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {timeSlots.map((slot) => (
                      <TableRow key={slot.id}>
                        <TableCell className="font-medium text-center">{slot.label}</TableCell>
                        {weekDays.map((day) => {
                          const isCourseOccupied = isSlotOccupiedByCourse(day.dayNumber, slot.id)
                          const isBooked = isSlotBooked(day.dayNumber, slot.id)
                          const slotInfo = getSlotInfo(day.dayNumber, slot.id)

                          return (
                            <TableCell key={day.dayNumber} className="p-0">
                              {isCourseOccupied ? (
                                <div className="w-full h-16 flex flex-col items-center justify-center bg-blue-100 text-blue-800 p-1">
                                  <div className="text-xs font-medium">{slotInfo?.name}</div>
                                  <div className="text-xs">{slotInfo?.teacher}</div>
                                </div>
                              ) : isBooked ? (
                                <div className="w-full h-16 flex flex-col items-center justify-center bg-red-100 text-red-800 p-1">
                                  <div className="text-xs font-medium">{slotInfo?.name}</div>
                                  <div className="text-xs">{slotInfo?.teacher}</div>
                                </div>
                              ) : (
                                <div
                                  className="w-full h-16 flex flex-col items-center justify-center bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer p-1"
                                  onClick={() => handleBooking(day.dayNumber, slot.id)}
                                >
                                  <BookOpen className="h-4 w-4 mb-1" />
                                  <div className="text-xs">可預約</div>
                                </div>
                              )}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
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

          {selectedBookingInfo && (
            <div className="space-y-6">
              {/* 上段：借用教室、借用時間、開始時段和結束時段 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">預約資訊</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="classroom">借用教室 *</Label>
                    <Select
                      value={selectedBookingInfo.classroom}
                      onValueChange={(value) => {
                        const classroom = classrooms.find((c) => c.name === value)
                        if (classroom) {
                          setSelectedBookingInfo((prev) => (prev ? { ...prev, classroom: value } : null))
                        }
                      }}
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
                        value={format(selectedBookingInfo.date, "yyyy-MM-dd")}
                        onChange={(e) => {
                          if (e.target.value) {
                            setSelectedBookingInfo((prev) =>
                              prev ? { ...prev, date: new Date(e.target.value) } : null,
                            )
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
                          <SelectItem key={slot.id} value={slot.label}>
                            {slot.label}（{slot.start_time}-{slot.end_time}）
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
                              timeSlots.findIndex((s) => s.label === bookingForm.startTimeSlot) <=
                                timeSlots.findIndex((s) => s.label === slot.label),
                          )
                          .map((slot) => (
                            <SelectItem key={slot.id} value={slot.label}>
                              {slot.label}（{slot.start_time}-{slot.end_time}）
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
