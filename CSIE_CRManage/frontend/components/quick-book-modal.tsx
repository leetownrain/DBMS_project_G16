"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

export function QuickBookModal({ data, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    room: data.room.id,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    studentId: "",
    name: "",
    email: "",
    phone: "",
    department: "",
    supervisor: "",
    title: "",
    purpose: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>預約教室</DialogTitle>
          <DialogDescription>
            預約 {data.room.name} 於 {data.formattedDate} {data.timeBlockLabel || `${data.startTime}-${data.endTime}`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">申請人資訊</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">
                  學號/編號 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="studentId"
                  name="studentId"
                  placeholder="請輸入學號或編號"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">
                  姓名 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="請輸入姓名"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  電子郵件 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="請輸入電子郵件"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">
                  電話 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="請輸入聯絡電話"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">
                  借用單位 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="department"
                  name="department"
                  placeholder="請輸入系所或單位名稱"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supervisor">指導老師</Label>
                <Input
                  id="supervisor"
                  name="supervisor"
                  placeholder="請輸入指導老師姓名"
                  value={formData.supervisor}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-medium">預約詳情</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">開始時間</Label>
                <Input id="startTime" name="startTime" value={formData.startTime} onChange={handleChange} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">結束時間</Label>
                <Input id="endTime" name="endTime" value={formData.endTime} onChange={handleChange} disabled />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">
                預約標題 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="例如：團隊會議、讀書會"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">借用說明</Label>
              <Textarea
                id="purpose"
                name="purpose"
                placeholder="請簡要描述您的借用目的和活動內容"
                value={formData.purpose}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button type="submit">確認預約</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
