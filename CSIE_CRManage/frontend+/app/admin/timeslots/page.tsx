"use client"

import { useEffect, useState } from "react"
import { API } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit } from "lucide-react"
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
import { Switch } from "@/components/ui/switch"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Sidebar } from "@/components/layout/sidebar"
import { RequireAuth } from "@/components/auth/require-auth"

type Section = {
  id: number
  label: string
  start_time: string
  end_time: string
  course_time_id: number | null
  active?: boolean
}

export default function TimeSlotsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTimeSlot, setEditingTimeSlot] = useState<Section | null>(null)
  const [sections, setSections] = useState<Section[]>([])

  const fetchSections = async () => {
    try {
      const res = await fetch(API.section.get_all_info, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (!res.ok) throw new Error("無法取得時段資料")
      const data: Section[] = await res.json()
      data.forEach((item) => {
        item.start_time = item.start_time.split(":").slice(0, 2).join(":")
        item.end_time = item.end_time.split(":").slice(0, 2).join(":")
        item.active = true // 假設預設啟用
      })
      setSections(data)
    } catch (error) {
      console.error("載入時段失敗：", error)
    }
  }

  useEffect(() => {
    fetchSections()
  }, [])

  const handleAddTimeSlot = () => {
    setEditingTimeSlot(null)
    setIsDialogOpen(true)
  }

  const handleEditTimeSlot = (timeSlot: Section) => {
    setEditingTimeSlot(timeSlot)
    setIsDialogOpen(true)
  }

  const handleSaveTimeSlot = async () => {
    const nameInput = document.getElementById("timeslot-name") as HTMLInputElement
    const startInput = document.getElementById("start-time") as HTMLInputElement
    const endInput = document.getElementById("end-time") as HTMLInputElement

    const payload = {
      label: nameInput.value,
      start_time: `${startInput.value}:00`,
      end_time: `${endInput.value}:00`,
    }

    try {
      if (editingTimeSlot) {
        // 編輯模式
        const res = await fetch(API.section.update(editingTimeSlot.id), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("更新失敗")
      } else {
        // 新增模式
        const res = await fetch(API.section.create, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("新增失敗")
      }

      await fetchSections()
      setIsDialogOpen(false)
    } catch (err) {
      console.error("儲存時段失敗：", err)
    }

  }

  return (
    <RequireAuth adminOnly>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1 className="text-3xl font-bold tracking-tight">時段管理</h1>
                <Button onClick={handleAddTimeSlot}>
                  <Plus className="w-4 h-4 mr-2" />
                  新增時段
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>時段設定</CardTitle>
                  <CardDescription>設定系統預設的可預約時段</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>時段名稱</TableHead>
                        <TableHead>開始時間</TableHead>
                        <TableHead>結束時間</TableHead>
                        <TableHead>狀態</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sections.map((slot) => (
                        <TableRow key={slot.id}>
                          <TableCell>{slot.label}</TableCell>
                          <TableCell>{slot.start_time}</TableCell>
                          <TableCell>{slot.end_time}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                slot.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {slot.active ? "啟用" : "停用"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleEditTimeSlot(slot)}>
                                <Edit className="w-4 h-4 mr-1" />
                                編輯
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
        <Footer />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTimeSlot ? "編輯時段" : "新增時段"}</DialogTitle>
              <DialogDescription>{editingTimeSlot ? "修改時段資訊" : "新增一個時段到系統中"}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="timeslot-name" className="text-right">
                  時段名稱
                </Label>
                <Input
                  id="timeslot-name"
                  defaultValue={editingTimeSlot?.label || ""}
                  placeholder="例如：第一節"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="start-time" className="text-right">
                  開始時間
                </Label>
                <Input
                  id="start-time"
                  type="time"
                  defaultValue={editingTimeSlot?.start_time || ""}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end-time" className="text-right">
                  結束時間
                </Label>
                <Input
                  id="end-time"
                  type="time"
                  defaultValue={editingTimeSlot?.end_time || ""}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  狀態
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch id="status" defaultChecked={editingTimeSlot?.active !== false} />
                  <Label htmlFor="status" className="cursor-pointer">
                    {editingTimeSlot?.active !== false ? "啟用" : "停用"}
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleSaveTimeSlot}>儲存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RequireAuth>
  )
}
