"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAdmin } from "@/contexts/admin-context"
import type { Classroom } from "@/contexts/admin-context"
import { API } from "@/lib/api"

interface ClassroomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  classroom: Classroom | null
  mode: "add" | "edit"
  onSubmitSuccess?: () => void
}

export function ClassroomDialog({ open, onOpenChange, classroom, mode, onSubmitSuccess}: ClassroomDialogProps) {
  const { addClassroom, updateClassroom } = useAdmin()
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    location: "",
    capacity: "",
    type: "lecture",
    isActive: true,
  })

  useEffect(() => {
    if (mode === "edit" && classroom) {
      setFormData({
        id: classroom.id,
        name: classroom.name,
        description: classroom.description || "空",
        location: classroom.location || "空",
        // capacity: classroom.capacity.toString() || "0",
        capacity: "30",
        type: classroom.type || "空",
        isActive: classroom.isActive,
      })
    } else if (mode === "add") {
      setFormData({
        id: "",
        name: "",
        description: "",
        location: "",
        capacity: "",
        type: "lecture",
        isActive: true,
      })
    }
  }, [classroom, mode, open])

  const handleFormChange = (e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTypeChange = (value : string) => {
    setFormData((prev) => ({ ...prev, type: value }))
  }

  const handleActiveChange = (checked : boolean) => {
    setFormData((prev) => ({
      ...prev,
      isActive: checked,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  
    const parsedCapacity = Number.parseInt(formData.capacity)
  
    const payload = {
      ...formData,
      capacity: parsedCapacity,
    }
  
    try {
      let res: Response
  
      if (mode === "edit" && classroom) {
        // ✅ 使用集中式 API 定義發送 PUT 更新
        res = await fetch(API.classroom.put_update_info(classroom.id), {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("更新教室失敗")
      } else {
        // ✅ 使用集中式 API 定義發送 POST 新增
        res = await fetch(API.classroom.post_create_new_data, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("新增教室失敗")
      }

      onSubmitSuccess?.()
      onOpenChange(false)
    } catch (error) {
      console.error("提交失敗：", error)
      alert("發生錯誤，請稍後再試")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "添加新教室" : "編輯教室"}</DialogTitle>
          <DialogDescription>
            {mode === "add" ? "填寫以下表單以添加新教室到系統中。" : "修改教室資訊。"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="id" className="text-right">
                教室ID
              </Label>
              <Input
                id="id"
                name="id"
                placeholder="a101"
                value={formData.id}
                onChange={handleFormChange}
                className="col-span-3"
                required
                disabled={mode === "edit"}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                名稱
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="A101講堂"
                value={formData.name}
                onChange={handleFormChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                描述
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="教室描述"
                value={formData.description}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                位置
              </Label>
              <Input
                id="location"
                name="location"
                placeholder="A棟, 一樓"
                value={formData.location}
                onChange={handleFormChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">
                容量
              </Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                placeholder="30"
                value={formData.capacity}
                onChange={handleFormChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                類型
              </Label>
              <Select value={formData.type} onValueChange={handleTypeChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="選擇教室類型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lecture">講堂</SelectItem>
                  <SelectItem value="lab">電腦實驗室</SelectItem>
                  <SelectItem value="conference">會議室</SelectItem>
                  <SelectItem value="seminar">研討室</SelectItem>
                  <SelectItem value="studio">工作室</SelectItem>
                  <SelectItem value="study">自習室</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="active" className="text-right">
                啟用狀態
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch id="active" checked={formData.isActive} onCheckedChange={handleActiveChange} />
                <Label htmlFor="active">{formData.isActive ? "啟用" : "停用"}</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit">{mode === "add" ? "添加教室" : "更新教室"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
