"use client"

import { useState } from "react"
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

export default function TimeSlotsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTimeSlot, setEditingTimeSlot] = useState<any>(null)

  // 模擬時段資料
  const timeSlots = [
    { id: 1, name: "第一節", startTime: "08:00", endTime: "09:00", active: true },
    { id: 2, name: "第二節", startTime: "09:00", endTime: "10:00", active: true },
    { id: 3, name: "第三節", startTime: "10:00", endTime: "11:00", active: true },
    { id: 4, name: "第四節", startTime: "11:00", endTime: "12:00", active: true },
    { id: 5, name: "中午", startTime: "12:00", endTime: "13:00", active: true },
    { id: 6, name: "第五節", startTime: "13:00", endTime: "14:00", active: true },
    { id: 7, name: "第六節", startTime: "14:00", endTime: "15:00", active: true },
    { id: 8, name: "第七節", startTime: "15:00", endTime: "16:00", active: true },
    { id: 9, name: "第八節", startTime: "16:00", endTime: "17:00", active: true },
    { id: 10, name: "第九節", startTime: "17:00", endTime: "18:00", active: true },
    { id: 11, name: "第十節", startTime: "18:00", endTime: "19:00", active: true },
    { id: 12, name: "第十一節", startTime: "19:00", endTime: "20:00", active: true },
    { id: 13, name: "第十二節", startTime: "20:00", endTime: "21:00", active: true },
    { id: 14, name: "第十三節", startTime: "21:00", endTime: "22:00", active: true },
  ]

  const handleAddTimeSlot = () => {
    setEditingTimeSlot(null)
    setIsDialogOpen(true)
  }

  const handleEditTimeSlot = (timeSlot: any) => {
    setEditingTimeSlot(timeSlot)
    setIsDialogOpen(true)
  }

  const handleSaveTimeSlot = () => {
    // 模擬儲存時段資料
    setIsDialogOpen(false)
    // 在實際應用中，這裡應該發送請求到後端API
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
                      {timeSlots.map((slot) => (
                        <TableRow key={slot.id}>
                          <TableCell>{slot.name}</TableCell>
                          <TableCell>{slot.startTime}</TableCell>
                          <TableCell>{slot.endTime}</TableCell>
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
                  defaultValue={editingTimeSlot?.name || ""}
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
                  defaultValue={editingTimeSlot?.startTime || ""}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end-time" className="text-right">
                  結束時間
                </Label>
                <Input id="end-time" type="time" defaultValue={editingTimeSlot?.endTime || ""} className="col-span-3" />
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
