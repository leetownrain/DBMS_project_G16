"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAdmin } from "@/contexts/admin-context"
import type { TimePeriod } from "@/contexts/admin-context"

interface TimePeriodDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  timePeriod: TimePeriod | null
  mode: "add" | "edit"
}

export function TimePeriodDialog({ open, onOpenChange, timePeriod, mode }: TimePeriodDialogProps) {
  const { addTimePeriod, updateTimePeriod } = useAdmin()
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    startTime: "",
    endTime: "",
    isActive: true,
    daysAvailable: ["週一", "週二", "週三", "週四", "週五"],
    description: "",
  })

  useEffect(() => {
    if (mode === "edit" && timePeriod) {
      setFormData({
        id: timePeriod.id,
        name: timePeriod.name,
        startTime: timePeriod.startTime,
        endTime: timePeriod.endTime,
        isActive: timePeriod.isActive,
        daysAvailable: timePeriod.daysAvailable,
        description: timePeriod.description,
      })
    } else if (mode === "add") {
      setFormData({
        id: "",
        name: "",
        startTime: "",
        endTime: "",
        isActive: true,
        daysAvailable: ["週一", "週二", "週三", "週四", "週五"],
        description: "",
      })
    }
  }, [timePeriod, mode, open])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleActiveChange = (checked) => {
    setFormData((prev) => ({
      ...prev,
      isActive: checked,
    }))
  }

  const handleDayToggle = (day) => {
    setFormData((prev) => {
      const currentDays = [...prev.daysAvailable]
      if (currentDays.includes(day)) {
        return {
          ...prev,
          daysAvailable: currentDays.filter((d) => d !== day),
        }
      } else {
        return {
          ...prev,
          daysAvailable: [...currentDays, day],
        }
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (mode === "edit") {
      updateTimePeriod(timePeriod!.id, formData)
    } else {
      addTimePeriod(formData)
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "添加新課節時段" : "編輯課節時段"}</DialogTitle>
          <DialogDescription>
            {mode === "add" ? "填寫以下表單以添加新的課節或休息時段。" : "修改課節或休息時段資訊。"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time-id" className="text-right">
                時段ID
              </Label>
              <Input
                id="time-id"
                name="id"
                placeholder="period-15"
                value={formData.id}
                onChange={handleFormChange}
                className="col-span-3"
                required
                disabled={mode === "edit"}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time-name" className="text-right">
                名稱
              </Label>
              <Input
                id="time-name"
                name="name"
                placeholder="第15節"
                value={formData.name}
                onChange={handleFormChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time-description" className="text-right">
                描述
              </Label>
              <Textarea
                id="time-description"
                name="description"
                placeholder="時段描述"
                value={formData.description}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time-start" className="text-right">
                開始時間
              </Label>
              <Input
                id="time-start"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleFormChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time-end" className="text-right">
                結束時間
              </Label>
              <Input
                id="time-end"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleFormChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">可用日</Label>
              <div className="col-span-3 flex flex-wrap gap-2">
                {["週一", "週二", "週三", "週四", "週五", "週六", "週日"].map((day) => (
                  <Button
                    key={day}
                    type="button"
                    // variant={formData.daysAvailable.includes(day) ? "default" : "outline"}
                    variant="default"
                    size="sm"
                    onClick={() => handleDayToggle(day)}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time-active" className="text-right">
                啟用狀態
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch id="time-active" checked={formData.isActive} onCheckedChange={handleActiveChange} />
                <Label htmlFor="time-active">{formData.isActive ? "啟用" : "停用"}</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit">{mode === "add" ? "添加時段" : "更新時段"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
