"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CalendarDays } from "lucide-react"
import { format } from "date-fns"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Sidebar } from "@/components/layout/sidebar"
import { RequireAuth } from "@/components/auth/require-auth"

// 更新時段資料，保留所有節次但移除時間顯示
const timeSlots = [
  { id: 1, name: "第一節" },
  { id: 2, name: "第二節" },
  { id: 3, name: "第三節" },
  { id: 4, name: "第四節" },
  { id: 5, name: "中午" },
  { id: 6, name: "第五節" },
  { id: 7, name: "第六節" },
  { id: 8, name: "第七節" },
  { id: 9, name: "第八節" },
  { id: 10, name: "第九節" },
  { id: 11, name: "第十節" },
  { id: 12, name: "第十一節" },
  { id: 13, name: "第十二節" },
  { id: 14, name: "第十三節" },
  { id: 15, name: "第十四節" },
]

// 模擬教室資料
const classrooms = [
  { id: "301", name: "301教室", capacity: 40, equipment: "投影機, 音響系統, 電腦" },
  { id: "302", name: "302教室", capacity: 30, equipment: "投影機, 白板" },
  { id: "303", name: "303教室", capacity: 30, equipment: "投影機, 白板" },
  { id: "401", name: "401教室", capacity: 50, equipment: "投影機, 電腦, 網路設備" },
  { id: "402", name: "402教室", capacity: 25, equipment: "實驗設備, 投影機" },
  { id: "501", name: "501教室", capacity: 60, equipment: "投影機, 音響系統, 電腦, 視訊會議設備" },
]

export default function NewBookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const classroomId = searchParams.get("classroom")
  const dateParam = searchParams.get("date")
  const slotParam = searchParams.get("slot")

  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState<Date>(dateParam ? new Date(dateParam) : new Date())
  const [selectedClassroom, setSelectedClassroom] = useState<string>(classroomId || "")
  const [startTimeSlot, setStartTimeSlot] = useState<string>(slotParam || "")
  const [endTimeSlot, setEndTimeSlot] = useState<string>("")

  // 如果URL中有參數，自動填入表單
  useEffect(() => {
    if (classroomId) {
      setSelectedClassroom(classroomId)
    }
    if (dateParam) {
      setDate(new Date(dateParam))
    }
    if (slotParam) {
      setStartTimeSlot(slotParam)
      // 預設結束時段為開始時段的下一節
      const nextSlot = Number(slotParam) + 1
      if (nextSlot <= timeSlots.length) {
        setEndTimeSlot(nextSlot.toString())
      }
    }
  }, [classroomId, dateParam, slotParam])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // 模擬提交請求
    setTimeout(() => {
      setIsLoading(false)
      router.push("/bookings")
    }, 1000)
  }

  return (
    <RequireAuth>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1 className="text-3xl font-bold tracking-tight">新增預約</h1>
              </div>
              <Card>
                <form onSubmit={handleSubmit}>
                  <CardHeader>
                    <CardTitle>教室預約申請</CardTitle>
                    <CardDescription>請填寫以下資訊申請教室預約</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="classroom">選擇教室</Label>
                        <Select required value={selectedClassroom} onValueChange={setSelectedClassroom}>
                          <SelectTrigger id="classroom">
                            <SelectValue placeholder="選擇教室" />
                          </SelectTrigger>
                          <SelectContent>
                            {classrooms.map((classroom) => (
                              <SelectItem key={classroom.id} value={classroom.id}>
                                {classroom.name} (容納 {classroom.capacity} 人)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">預約日期</Label>
                        <div className="relative">
                          <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="date"
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
                      <div className="space-y-2">
                        <Label htmlFor="start-time">開始時段</Label>
                        <Select required value={startTimeSlot} onValueChange={setStartTimeSlot}>
                          <SelectTrigger id="start-time">
                            <SelectValue placeholder="選擇時段" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((slot) => (
                              <SelectItem key={slot.id} value={slot.id.toString()}>
                                {slot.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end-time">結束時段</Label>
                        <Select required value={endTimeSlot} onValueChange={setEndTimeSlot}>
                          <SelectTrigger id="end-time">
                            <SelectValue placeholder="選擇時段" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots
                              .filter((slot) => !startTimeSlot || Number.parseInt(startTimeSlot) < slot.id)
                              .map((slot) => (
                                <SelectItem key={slot.id} value={slot.id.toString()}>
                                  {slot.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="purpose">用途</Label>
                        <Input id="purpose" placeholder="例如：課程、會議、活動等" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="participants">參與人數</Label>
                        <Input id="participants" type="number" min="1" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">詳細說明</Label>
                      <Textarea id="description" placeholder="請詳細說明預約用途及需求" rows={4} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="equipment">需要設備</Label>
                      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="projector" className="rounded border-gray-300" />
                          <label htmlFor="projector">投影機</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="computer" className="rounded border-gray-300" />
                          <label htmlFor="computer">電腦</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="audio" className="rounded border-gray-300" />
                          <label htmlFor="audio">音響系統</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="whiteboard" className="rounded border-gray-300" />
                          <label htmlFor="whiteboard">白板</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="network" className="rounded border-gray-300" />
                          <label htmlFor="network">網路設備</label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" type="button" onClick={() => router.back()}>
                      取消
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "提交中..." : "提交申請"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </RequireAuth>
  )
}
