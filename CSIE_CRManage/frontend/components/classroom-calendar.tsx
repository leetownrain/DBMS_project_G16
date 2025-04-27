"use client"

import { useState, useMemo } from "react"
import {
  addDays,
  format,
  startOfWeek,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isToday,
} from "date-fns"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { QuickBookModal } from "@/components/quick-book-modal"
import { CancelBookingDialog } from "@/components/cancel-booking-dialog"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { zhTW } from "date-fns/locale"

// 預約的模擬資料
const initialBookings = [
  { id: 1, room: "a101", title: "計算機科學101講座", start: "09:00", end: "10:30", day: 1, date: "2025-04-14" },
  { id: 2, room: "b205", title: "程式設計實驗", start: "13:00", end: "15:00", day: 1, date: "2025-04-14" },
  { id: 3, room: "c103", title: "部門會議", start: "11:00", end: "12:00", day: 2, date: "2025-04-15" },
  { id: 4, room: "a101", title: "物理講座", start: "14:00", end: "15:30", day: 3, date: "2025-04-16" },
  { id: 5, room: "d201", title: "工作坊", start: "10:00", end: "12:00", day: 4, date: "2025-04-17" },
  { id: 6, room: "e105", title: "藝術課", start: "15:00", end: "17:00", day: 4, date: "2025-04-17" },
  { id: 7, room: "a101", title: "數學講座", start: "09:00", end: "10:30", day: 5, date: "2025-04-18" },
  { id: 8, room: "f302", title: "讀書小組", start: "16:00", end: "18:00", day: 5, date: "2025-04-18" },
]

// 教室的模擬資料
const rooms = [
  { id: "a101", name: "A101講堂", building: "A棟", floor: "一樓" },
  { id: "b205", name: "B205電腦實驗室", building: "B棟", floor: "二樓" },
  { id: "c103", name: "C103會議室", building: "C棟", floor: "一樓" },
  { id: "d201", name: "D201研討室", building: "D棟", floor: "二樓" },
  { id: "e105", name: "E105工作室", building: "E棟", floor: "一樓" },
  { id: "f302", name: "F302自習室", building: "F棟", floor: "三樓" },
]

// 更新時間區塊以匹配課節時段系統
const timeBlocks = [
  { label: "第1節 (08:00-08:50)", start: "08:00", end: "08:50" },
  { label: "第2節 (09:00-09:50)", start: "09:00", end: "09:50" },
  { label: "第3節 (10:10-11:00)", start: "10:10", end: "11:00" },
  { label: "第4節 (11:10-12:00)", start: "11:10", end: "12:00" },
  { label: "午休 (12:00-13:10)", start: "12:00", end: "13:10" },
  { label: "第5節 (13:20-14:10)", start: "13:20", end: "14:10" },
  { label: "第6節 (14:20-15:10)", start: "14:20", end: "15:10" },
  { label: "第7節 (15:30-16:20)", start: "15:30", end: "16:20" },
  { label: "第8節 (16:30-17:20)", start: "16:30", end: "17:20" },
  { label: "第9節 (17:30-18:20)", start: "17:30", end: "18:20" },
  { label: "第10節 (18:30-19:20)", start: "18:30", end: "19:20" },
  { label: "第11節 (19:30-20:20)", start: "19:30", end: "20:20" },
  { label: "第12節 (20:30-21:20)", start: "20:30", end: "21:20" },
  { label: "第13節 (21:30-22:20)", start: "21:30", end: "22:20" },
  { label: "第14節 (22:30-23:20)", start: "22:30", end: "23:20" },
]

// 更新小時列表以匹配課節時段
const hours = [
  "08:00",
  "09:00",
  "10:10",
  "11:10",
  "12:00",
  "13:20",
  "14:20",
  "15:30",
  "16:30",
  "17:30",
  "18:30",
  "19:30",
  "20:30",
  "21:30",
  "22:30",
  "23:20",
]

// 在 ClassroomCalendar 組件的頂部添加一個視圖切換選項卡
export function ClassroomCalendar() {
  const { toast } = useToast()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedRoom, setSelectedRoom] = useState("all")
  const [viewType, setViewType] = useState("month")
  const [viewMode, setViewMode] = useState("calendar") // 網格視圖/日曆視圖切換
  const [bookings, setBookings] = useState(initialBookings)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTimeBlock, setSelectedTimeBlock] = useState(null)
  const [quickBookData, setQuickBookData] = useState(null)
  const [bookingToCancel, setBookingToCancel] = useState(null)

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }) // 從週一開始
  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(startDate, i))

  // 月視圖資料
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // 添加上個月的日期以從週一開始日曆
  const startDay = getDay(monthStart) || 7 // 將週日（0）轉換為7
  const daysFromPrevMonth = startDay === 1 ? 0 : startDay - 1 // 如果是週一，則不需要天數

  const calendarDays = useMemo(() => {
    const prevMonthDays = Array.from({ length: daysFromPrevMonth }, (_, i) =>
      addDays(monthStart, -(daysFromPrevMonth - i)),
    )

    // 計算我們需要從下個月添加多少天來完成網格
    const totalDaysInGrid = Math.ceil((monthDays.length + daysFromPrevMonth) / 7) * 7
    const daysFromNextMonth = totalDaysInGrid - (monthDays.length + daysFromPrevMonth)

    const nextMonthDays = Array.from({ length: daysFromNextMonth }, (_, i) => addDays(monthEnd, i + 1))

    return [...prevMonthDays, ...monthDays, ...nextMonthDays]
  }, [monthStart, monthEnd, monthDays, daysFromPrevMonth])

  const filteredBookings =
    selectedRoom === "all" ? bookings : bookings.filter((booking) => booking.room === selectedRoom)

  const previousPeriod = () => {
    if (viewType === "week") {
      setCurrentDate((prev) => addDays(prev, -7))
    } else if (viewType === "day") {
      setCurrentDate((prev) => addDays(prev, -1))
    } else if (viewType === "month") {
      setCurrentDate((prev) => subMonths(prev, 1))
    }
  }

  const nextPeriod = () => {
    if (viewType === "week") {
      setCurrentDate((prev) => addDays(prev, 7))
    } else if (viewType === "day") {
      setCurrentDate((prev) => addDays(prev, 1))
    } else if (viewType === "month") {
      setCurrentDate((prev) => addMonths(prev, 1))
    }
  }

  const getBookingsForDateAndTimeBlock = (date, timeBlock, roomId = null) => {
    const formattedDate = format(date, "yyyy-MM-dd")
    const filteredByDate = filteredBookings.filter(
      (booking) => booking.date === formattedDate && booking.start < timeBlock.end && booking.end > timeBlock.start,
    )

    if (roomId) {
      return filteredByDate.filter((booking) => booking.room === roomId)
    }

    return filteredByDate
  }

  const isRoomAvailableForTimeBlock = (roomId, date, timeBlock) => {
    return getBookingsForDateAndTimeBlock(date, timeBlock, roomId).length === 0
  }

  const handleDateClick = (date) => {
    setSelectedDate(date)
  }

  const handleTimeBlockClick = (timeBlock) => {
    setSelectedTimeBlock(timeBlock)
  }

  // 獲取時段標籤
  const getTimeBlockLabel = (start, end) => {
    const matchingBlock = timeBlocks.find((block) => block.start === start && block.end === end)
    return matchingBlock ? matchingBlock.label : `${start}-${end}`
  }

  // 檢查時段是否為午休 - 現在午休時段可預約
  const isLunchBreak = (timeBlock) => {
    return false // 午休時段現在可預約
  }

  // 在 handleCellClick 函數中，添加對午休時段的特殊處理
  const handleCellClick = (room, date, timeBlock) => {
    // 檢查是否為午休時段
    if (isLunchBreak(timeBlock)) {
      toast({
        title: "午休時段",
        description: "午休時段不可預約教室。",
        variant: "destructive",
      })
      return
    }

    // 檢查單元格是否有預約
    const bookingsForSlot = getBookingsForDateAndTimeBlock(date, timeBlock, room.id)

    if (bookingsForSlot.length > 0) {
      // 如果有預約，顯示取消對話框
      setBookingToCancel(bookingsForSlot[0])
    } else if (isRoomAvailableForTimeBlock(room.id, date, timeBlock)) {
      // 如果可用，顯示預約模態框
      setQuickBookData({
        room: room,
        date: format(date, "yyyy-MM-dd"),
        formattedDate: format(date, "yyyy年MM月dd日"),
        startTime: timeBlock.start,
        endTime: timeBlock.end,
        timeBlockLabel: timeBlock.label,
      })
    }
  }

  const handleCloseModal = () => {
    setQuickBookData(null)
  }

  const handleCloseDialog = () => {
    setBookingToCancel(null)
  }

  const handleBookingSubmit = (bookingData) => {
    // 為預約生成新ID
    const newId = Math.max(...bookings.map((b) => b.id), 0) + 1

    // 創建新的預約對象
    const bookingToAdd = {
      id: newId,
      room: bookingData.room,
      title: bookingData.title,
      start: bookingData.startTime,
      end: bookingData.endTime,
      day: new Date(bookingData.date).getDay() || 7, // 將週日（0）轉換為7
      date: bookingData.date,
    }

    // 將新預約添加到狀態
    setBookings((prev) => [...prev, bookingToAdd])
    setQuickBookData(null)

    toast({
      title: "預約確認",
      description: `您已預約${bookingData.room}於${bookingData.formattedDate}`,
    })
  }

  const handleConfirmCancel = () => {
    if (bookingToCancel) {
      // 移除預約
      setBookings((prev) => prev.filter((booking) => booking.id !== bookingToCancel.id))
      setBookingToCancel(null)

      toast({
        title: "預約已取消",
        description: "教室預約已成功取消。",
      })
    }
  }

  // 添加日視圖的渲染邏輯

  // 在 ClassroomCalendar 組件中，添加日視圖的渲染邏輯
  const renderDayView = () => {
    if (viewType !== "day") return null

    // 獲取當天所有教室的預約
    const dayBookings = filteredBookings.filter((booking) => booking.date === format(currentDate, "yyyy-MM-dd"))

    // 使用固定的時間段
    const timeSlots = [
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
    ]

    return (
      <div className="border rounded-md overflow-auto">
        <div className="min-w-[1200px]">
          {/* 時間標題行 */}
          <div className="grid grid-cols-[200px_repeat(13,1fr)] border-b">
            <div className="p-3 font-medium border-r">教室 / 時間</div>
            {timeSlots.map((time, idx) => (
              <div key={idx} className="p-3 text-center font-medium border-r">
                {time}
              </div>
            ))}
          </div>

          {/* 教室行 */}
          {rooms.map((room) => {
            // 獲取該教室的預約
            const roomBookings = dayBookings.filter((booking) => booking.room === room.id)

            return (
              <div key={room.id} className="grid grid-cols-[200px_repeat(13,1fr)] border-b hover:bg-gray-50">
                {/* 教室信息 */}
                <div className="p-3 border-r">
                  <div className="font-medium">{room.name}</div>
                  <div className="text-xs text-muted-foreground">{room.building}棟</div>
                </div>

                {/* 時間格子 */}
                {timeSlots.map((time, timeIdx) => {
                  // 檢查該時段是否有預約
                  const isBooked = roomBookings.some((booking) => booking.start <= time && booking.end > time)

                  // 獲取該時段的預約（如果有）
                  const booking = roomBookings.find((booking) => booking.start <= time && booking.end > time)

                  // 午休時段現在可預約
                  const isLunch = false

                  return (
                    <div
                      key={timeIdx}
                      className={cn("border-r text-center", isBooked ? "bg-primary/10" : "bg-green-50")}
                      onClick={() => {
                        if (!isBooked) {
                          // 創建時間區塊對象
                          const timeBlock = {
                            start: time,
                            end: timeSlots[timeIdx + 1] || "21:00",
                            label: `${time}-${timeSlots[timeIdx + 1] || "21:00"}`,
                          }
                          handleCellClick(room, currentDate, timeBlock)
                        }
                      }}
                    >
                      <div className="h-full flex flex-col justify-center items-center py-2">
                        {isBooked ? (
                          <div className="text-primary font-medium">{booking.title}</div>
                        ) : (
                          <>
                            <div className="text-green-600 text-sm">可用</div>
                            {!isLunch && <div className="text-green-600 text-xs">點擊預訂</div>}
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // 更新時段和教室選擇視圖，處理午休時段

  // 如果選擇了日期和時間區塊，顯示該時段的教室可用性
  if (selectedDate && selectedTimeBlock) {
    // 檢查是否為午休時段
    const isLunch = isLunchBreak(selectedTimeBlock)

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">
            {format(selectedDate, "yyyy年MM月dd日")} - {selectedTimeBlock.label}
          </h3>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedDate(null)
              setSelectedTimeBlock(null)
            }}
          >
            返回月視圖
          </Button>
        </div>

        {
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => {
              const bookingsForSlot = getBookingsForDateAndTimeBlock(selectedDate, selectedTimeBlock, room.id)
              const isAvailable = bookingsForSlot.length === 0

              return (
                <Card
                  key={room.id}
                  className={cn(
                    "p-4 cursor-pointer transition-colors",
                    isAvailable
                      ? "hover:bg-green-50 dark:hover:bg-green-900/20 border-green-200 dark:border-green-800"
                      : "hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800",
                  )}
                  onClick={() => handleCellClick(room, selectedDate, selectedTimeBlock)}
                >
                  <h4 className="font-medium">{room.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {room.building}, {room.floor}
                  </p>

                  {isAvailable ? (
                    <div className="mt-2 text-green-600 dark:text-green-400 text-sm font-medium">可用 - 點擊預約</div>
                  ) : (
                    <div className="mt-2 space-y-2">
                      {bookingsForSlot.map((booking) => (
                        <div key={booking.id} className="bg-primary/10 border border-primary rounded p-2 text-sm">
                          <div className="font-medium">{booking.title}</div>
                          <div className="text-muted-foreground">
                            {booking.start} - {booking.end}
                          </div>
                          <div className="text-xs mt-1 text-center text-muted-foreground">點擊取消</div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        }
      </div>
    )
  }

  // 更新日視圖，顯示課節時段而不是小時

  // 修改日視圖的渲染邏輯
  if (selectedDate) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">{format(selectedDate, "yyyy年MM月dd日")}</h3>
          <Button variant="outline" onClick={() => setSelectedDate(null)}>
            返回月視圖
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {timeBlocks.map((timeBlock, index) => {
            // 特殊處理午休時段
            const isLunch = isLunchBreak(timeBlock)

            const bookingsForTimeBlock = getBookingsForDateAndTimeBlock(
              selectedDate,
              timeBlock,
              selectedRoom !== "all" ? selectedRoom : null,
            )

            const totalRooms = rooms.length
            const bookedRooms =
              selectedRoom === "all"
                ? new Set(bookingsForTimeBlock.map((b) => b.room)).size
                : bookingsForTimeBlock.length
            const availableRooms = totalRooms - bookedRooms

            return (
              <Card
                key={index}
                className={cn(
                  "p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                  isLunch && "bg-gray-100 dark:bg-gray-800/50 border-dashed",
                )}
                onClick={() => !isLunch && handleTimeBlockClick(timeBlock)}
              >
                <h4 className="font-medium">{timeBlock.label}</h4>
                <p className="text-sm text-muted-foreground">
                  {timeBlock.start} - {timeBlock.end}
                </p>

                {
                  <>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant={availableRooms > 0 ? "default" : "destructive"}>{availableRooms} 可用</Badge>
                      <Badge variant="secondary">{bookedRooms} 已預約</Badge>
                    </div>

                    {selectedRoom !== "all" && (
                      <div className="mt-2 text-sm">
                        {bookingsForTimeBlock.length > 0 ? (
                          <span className="text-red-500 dark:text-red-400">已預約</span>
                        ) : (
                          <span className="text-green-500 dark:text-green-400">可用</span>
                        )}
                      </div>
                    )}
                  </>
                }
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  // 更新週視圖，使其與課節時段系統兼容

  // 在 ClassroomCalendar 組件中，添加週視圖的渲染邏輯
  const renderWeekView = () => {
    if (viewType !== "week") return null

    return (
      <div className="border rounded-md overflow-auto">
        <div className="grid grid-cols-6 min-w-[800px]">
          {/* 時間列 */}
          <div className="border-r">
            <div className="h-12 border-b"></div>
            {timeBlocks.map((block, idx) => (
              <div key={idx} className="h-16 border-b p-1 text-xs">
                <div className="font-medium">{block.label}</div>
                <div className="text-muted-foreground">
                  {block.start}-{block.end}
                </div>
              </div>
            ))}
          </div>

          {/* 週一到週五 */}
          {weekDays.map((day, dayIdx) => (
            <div key={dayIdx} className="border-r">
              <div className="h-12 border-b p-2 text-center font-medium">
                <div>{format(day, "EEE", { locale: zhTW })}</div>
                <div className="text-sm text-muted-foreground">{format(day, "MM/dd")}</div>
              </div>

              {timeBlocks.map((block, blockIdx) => {
                // 檢查是否為午休時段
                const isLunch = isLunchBreak(block)

                // 獲取該時段的預約
                const bookingsForBlock =
                  selectedRoom === "all"
                    ? filteredBookings.filter(
                        (booking) =>
                          booking.date === format(day, "yyyy-MM-dd") &&
                          booking.start < block.end &&
                          booking.end > block.start,
                      )
                    : filteredBookings.filter(
                        (booking) =>
                          booking.date === format(day, "yyyy-MM-dd") &&
                          booking.start < block.end &&
                          booking.end > block.start &&
                          booking.room === selectedRoom,
                      )

                return (
                  <div
                    key={blockIdx}
                    className={cn(
                      "h-16 border-b p-1 relative",
                      isLunch ? "bg-gray-100 dark:bg-gray-800/50" : "",
                      isToday(day) ? "bg-blue-50 dark:bg-blue-900/10" : "",
                    )}
                    onClick={() =>
                      !isLunch &&
                      handleCellClick({ id: selectedRoom !== "all" ? selectedRoom : rooms[0].id }, day, block)
                    }
                  >
                    {isLunch ? (
                      <div className="text-xs text-amber-500 dark:text-amber-400 h-full flex items-center justify-center">
                        午休時段
                      </div>
                    ) : bookingsForBlock.length > 0 ? (
                      <div className="absolute inset-1 bg-primary/10 border border-primary rounded p-1 text-xs overflow-hidden">
                        {bookingsForBlock.slice(0, 2).map((booking, i) => (
                          <div key={i} className="truncate">
                            {booking.title}
                          </div>
                        ))}
                        {bookingsForBlock.length > 2 && (
                          <div className="text-muted-foreground text-center">+{bookingsForBlock.length - 2}</div>
                        )}
                      </div>
                    ) : (
                      <div className="h-full w-full cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20 rounded"></div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // 月視圖日曆
  return (
    <div className="space-y-4">
      {/* 移除重複的視圖選項卡，只保留一組 */
      /*
      <Tabs value={viewMode} onValueChange={setViewMode} className="w-full sm:w-auto">
        <TabsList className="grid w-full max-w-[200px] grid-cols-2">
          <TabsTrigger value="grid">網格視圖</TabsTrigger>
          <TabsTrigger value="calendar">日曆視圖</TabsTrigger>
        </TabsList>
      </Tabs>*/}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={previousPeriod}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="min-w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(currentDate, "MMMM d, yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={currentDate}
                onSelect={(date) => date && setCurrentDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button variant="outline" size="icon" onClick={nextPeriod}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Tabs value={viewType} onValueChange={setViewType} className="w-full sm:w-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="month">月視圖</TabsTrigger>
              <TabsTrigger value="week">週視圖</TabsTrigger>
              <TabsTrigger value="day">日視圖</TabsTrigger>
            </TabsList>
          </Tabs>

          {viewType !== "day" && (
            <Select value={selectedRoom} onValueChange={setSelectedRoom}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="選擇教室" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有教室</SelectItem>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {viewType === "day" && renderDayView()}
      {viewType === "week" && renderWeekView()}

      {viewType !== "week" && viewType !== "day" && (
        <div className="min-w-[800px] overflow-x-auto">
          <div className="grid grid-cols-7 gap-1">
            {/* 帶有星期幾的標題行 */}
            {["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"].map((day, i) => (
              <div key={i} className="h-10 flex items-center justify-center font-medium">
                {day}
              </div>
            ))}

            {/* 日曆天數 */}
            {calendarDays.map((day, i) => {
              const isCurrentMonth = day.getMonth() === monthStart.getMonth()
              const isDayToday = isToday(day)

              // 獲取此日的所有預約，按課節時段分組
              const dayBookings = []
              timeBlocks.forEach((timeBlock) => {
                // 跳過午休時段的計算
                if (isLunchBreak(timeBlock)) return

                const bookingsForBlock = getBookingsForDateAndTimeBlock(
                  day,
                  timeBlock,
                  selectedRoom !== "all" ? selectedRoom : null,
                )
                dayBookings.push(...bookingsForBlock)
              })

              // 計算唯一預約
              const uniqueBookings = new Set(dayBookings.map((b) => b.id)).size

              // 計算可用性 (排除午休時段)
              const totalTimeSlots =
                selectedRoom === "all"
                  ? (timeBlocks.length - 1) * rooms.length // 減1是為了排除午
                  : timeBlocks.length - 1 // 減1是為了排除午休

              const bookedTimeSlots = selectedRoom === "all" ? dayBookings.length : uniqueBookings
              const availabilityPercentage = Math.max(0, 100 - (bookedTimeSlots / totalTimeSlots) * 100)

              // 根據可用性確定顏色
              let availabilityColor = "bg-green-100 dark:bg-green-900/20"
              if (availabilityPercentage < 30) {
                availabilityColor = "bg-red-100 dark:bg-red-900/20"
              } else if (availabilityPercentage < 70) {
                availabilityColor = "bg-yellow-100 dark:bg-yellow-900/20"
              }

              return (
                <div
                  key={i}
                  className={cn(
                    "min-h-[120px] p-1 border cursor-pointer transition-colors",
                    isCurrentMonth ? "bg-background" : "bg-muted/30 text-muted-foreground",
                    isDayToday && "border-primary",
                    availabilityColor,
                  )}
                  onClick={() => handleDateClick(day)}
                >
                  <div className="flex justify-between items-start">
                    <span
                      className={cn(
                        "font-medium text-sm",
                        isDayToday &&
                          "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center",
                      )}
                    >
                      {format(day, "d")}
                    </span>

                    {uniqueBookings > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {uniqueBookings} 已預約
                      </Badge>
                    )}
                  </div>

                  {selectedRoom !== "all" && (
                    <div className="mt-2 space-y-1">
                      {dayBookings.slice(0, 2).map((booking, idx) => (
                        <div key={idx} className="text-xs truncate bg-primary/10 p-1 rounded">
                          {booking.title}
                        </div>
                      ))}
                      {dayBookings.length > 2 && (
                        <div className="text-xs text-muted-foreground text-center">+{dayBookings.length - 2} 更多</div>
                      )}
                    </div>
                  )}

                  <div className="mt-2 text-xs">
                    <div className="flex justify-between">
                      <span>可用率:</span>
                      <span
                        className={cn(
                          availabilityPercentage < 30
                            ? "text-red-600 dark:text-red-400"
                            : availabilityPercentage < 70
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-green-600 dark:text-green-400",
                        )}
                      >
                        {Math.round(availabilityPercentage)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-1 mt-1 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full",
                          availabilityPercentage < 30
                            ? "bg-red-500"
                            : availabilityPercentage < 70
                              ? "bg-yellow-500"
                              : "bg-green-500",
                        )}
                        style={{ width: `${availabilityPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {quickBookData && (
        <QuickBookModal data={quickBookData} onClose={handleCloseModal} onSubmit={handleBookingSubmit} />
      )}

      {bookingToCancel && (
        <CancelBookingDialog booking={bookingToCancel} onClose={handleCloseDialog} onConfirm={handleConfirmCancel} />
      )}
    </div>
  )
}
