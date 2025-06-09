"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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

export default function ClassroomsManagementPage() {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingClassroom, setEditingClassroom] = useState<any>(null)

  // 模擬教室資料
  const classrooms = [
    { id: "301", name: "301教室", capacity: 40, active: true },
    { id: "302", name: "302教室", capacity: 30, active: true },
    { id: "303", name: "303教室", capacity: 30, active: false },
    { id: "401", name: "401教室", capacity: 50, active: true },
    { id: "402", name: "402教室", capacity: 25, active: true },
    { id: "501", name: "501教室", capacity: 60, active: true },
    { id: "502", name: "502教室", capacity: 45, active: false },
  ]

  const handleAddClassroom = () => {
    setEditingClassroom(null)
    setIsDialogOpen(true)
  }

  const handleEditClassroom = (classroom: any) => {
    setEditingClassroom(classroom)
    setIsDialogOpen(true)
  }

  const handleSaveClassroom = () => {
    // 模擬儲存教室資料
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
                                classroom.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {classroom.active ? "啟用" : "停用"}
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
                  <Switch id="classroom-active" defaultChecked={editingClassroom?.active !== false} />
                  <Label htmlFor="classroom-active" className="cursor-pointer">
                    {editingClassroom?.active !== false ? "啟用" : "停用"}
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
