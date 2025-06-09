"use client"

import { useEffect, useState } from "react"
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
import { API } from "@/lib/api"

interface Classroom {
  id: string
  name: string
  capacity: number
  isActive: boolean
}

export default function ClassroomsManagementPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null)
  const [classrooms, setClassrooms] = useState<Classroom[]>([])

  const fetchClassrooms = async () => {
    try {
      const res = await fetch(API.classroom.get_all_info)
      if (!res.ok) throw new Error("無法取得教室資料")
      const data = await res.json()
      setClassrooms(data)
    } catch (error) {
      console.error("載入教室失敗：", error)
    }
  }

  useEffect(() => {
    fetchClassrooms()
  }, [])

  const handleAddClassroom = () => {
    setEditingClassroom(null)
    setIsDialogOpen(true)
  }

  const handleEditClassroom = (classroom: Classroom) => {
    setEditingClassroom(classroom)
    setIsDialogOpen(true)
  }

  const handleSaveClassroom = async () => {
    const idInput = document.getElementById("classroom-id") as HTMLInputElement
    const nameInput = document.getElementById("classroom-name") as HTMLInputElement
    const capacityInput = document.getElementById("classroom-capacity") as HTMLInputElement
    const activeInput = document.getElementById("classroom-active") as HTMLElement

    const updatedPayload: Partial<Classroom> = {
      name: nameInput.value,
      capacity: parseInt(capacityInput.value, 10),
      isActive: activeInput.getAttribute("aria-checked") === "true",
    }

    try {
      if (editingClassroom) {
        const res = await fetch(API.classroom.update(editingClassroom.id), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedPayload),
        })
        if (!res.ok) throw new Error("更新失敗")
      } else {
        const res = await fetch(API.classroom.create, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: idInput.value,
            ...updatedPayload,
          }),
        })
        if (!res.ok) throw new Error("新增失敗")
      }

      await fetchClassrooms()
      setIsDialogOpen(false)
    } catch (err) {
      console.error("儲存教室失敗：", err)
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
                <h1 className="text-3xl font-bold tracking-tight">教室管理</h1>
                <Button onClick={handleAddClassroom}>
                  <Plus className="w-4 h-4 mr-2" />
                  新增教室
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>教室列表</CardTitle>
                  <CardDescription>管理系統中的所有教室</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>教室編號</TableHead>
                        <TableHead>教室名稱</TableHead>
                        <TableHead>容納人數</TableHead>
                        <TableHead>啟用狀態</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {classrooms.map((classroom) => (
                        <TableRow key={classroom.id}>
                          <TableCell>{classroom.id}</TableCell>
                          <TableCell>{classroom.name}</TableCell>
                          <TableCell>{classroom.capacity}人</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                classroom.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {classroom.isActive ? "啟用" : "停用"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleEditClassroom(classroom)}>
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
              <DialogTitle>{editingClassroom ? "編輯教室" : "新增教室"}</DialogTitle>
              <DialogDescription>{editingClassroom ? "修改教室資訊" : "新增一個教室到系統中"}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="classroom-id" className="text-right">
                  教室編號
                </Label>
                <Input
                  id="classroom-id"
                  defaultValue={editingClassroom?.id || ""}
                  placeholder="例如：301"
                  className="col-span-3"
                  disabled={!!editingClassroom}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="classroom-name" className="text-right">
                  教室名稱
                </Label>
                <Input
                  id="classroom-name"
                  defaultValue={editingClassroom?.name || ""}
                  placeholder="例如：301教室"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="classroom-capacity" className="text-right">
                  容納人數
                </Label>
                <Input
                  id="classroom-capacity"
                  type="number"
                  min="1"
                  defaultValue={editingClassroom?.capacity || ""}
                  placeholder="例如：40"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="classroom-active" className="text-right">
                  啟用狀態
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch id="classroom-active" defaultChecked={editingClassroom?.isActive !== false} />
                  <Label htmlFor="classroom-active" className="cursor-pointer">
                    {editingClassroom?.isActive !== false ? "啟用" : "停用"}
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleSaveClassroom}>儲存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RequireAuth>
  )
}