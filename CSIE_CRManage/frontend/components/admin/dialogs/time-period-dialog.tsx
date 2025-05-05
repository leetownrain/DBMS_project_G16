"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { API } from "@/lib/api"

interface Section {
  id: number
  name: string
  start_time: string
  end_time: string
}

interface TimePeriodDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  timePeriod: Section | null
  mode: "add" | "edit"
}

export function TimePeriodDialog({
  open,
  onOpenChange,
  timePeriod,
  mode,
}: TimePeriodDialogProps) {
  const [formState, setFormState] = useState({
    id: "",
    name: "",
    start_time: "",
    end_time: "",
  })

  useEffect(() => {
    if (mode === "edit" && timePeriod) {
      setFormState({
        id: timePeriod.id.toString(),
        name: timePeriod.name,
        start_time: timePeriod.start_time,
        end_time: timePeriod.end_time,
      })
    } else {
      setFormState({
        id: "",
        name: "",
        start_time: "",
        end_time: "",
      })
    }
  }, [mode, timePeriod, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      name: formState.name,
      start_time: formState.start_time,
      end_time: formState.end_time,
    }

    try {
      if (mode === "edit" && timePeriod) {
        await fetch(`${API.section.update_info}/${timePeriod.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      } else {
        await fetch(API.section.create_new_data, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      }

      onOpenChange(false)
    } catch (error) {
      console.error("儲存失敗：", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "新增課節時段" : "編輯課節時段"}</DialogTitle>
          <DialogDescription>
            {mode === "add" ? "請填寫以下資料來新增課節時段。" : "請修改課節時段資料。"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="id" className="text-right">時段 ID</Label>
              <Input
                id="id"
                name="id"
                value={formState.id}
                onChange={handleChange}
                placeholder="period-01"
                required
                disabled={mode === "edit"}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">名稱</Label>
              <Input
                id="name"
                name="name"
                value={formState.name}
                onChange={handleChange}
                placeholder="第1節"
                required
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start_time" className="text-right">開始時間</Label>
              <Input
                id="start_time"
                name="start_time"
                type="time"
                value={formState.start_time}
                onChange={handleChange}
                required
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="end_time" className="text-right">結束時間</Label>
              <Input
                id="end_time"
                name="end_time"
                type="time"
                value={formState.end_time}
                onChange={handleChange}
                required
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit">{mode === "add" ? "新增時段" : "儲存修改"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
