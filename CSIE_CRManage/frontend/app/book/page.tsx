"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Separator } from "@/components/ui/separator"

export default function BookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const defaultRoom = searchParams.get("room") || ""

  const [date, setDate] = useState<Date>()
  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    email: "",
    phone: "",
    department: "",
    supervisor: "",
    purpose: "",
    room: defaultRoom,
    startPeriod: "",
    endPeriod: "",
  })

  // 課節時段選項
  const periodOptions = [
    { value: "1", label: "第1節 (08:00-08:50)" },
    { value: "2", label: "第2節 (09:00-09:50)" },
    { value: "3", label: "第3節 (10:10-11:00)" },
    { value: "4", label: "第4節 (11:10-12:00)" },
    { value: "5", label: "第5節 (13:20-14:10)" },
    { value: "6", label: "第6節 (14:20-15:10)" },
    { value: "7", label: "第7節 (15:30-16:20)" },
    { value: "8", label: "第8節 (16:30-17:20)" },
    { value: "9", label: "第9節 (17:30-18:20)" },
    { value: "10", label: "第10節 (18:30-19:20)" },
    { value: "11", label: "第11節 (19:30-20:20)" },
    { value: "12", label: "第12節 (20:30-21:20)" },
    { value: "13", label: "第13節 (21:30-22:20)" },
    { value: "14", label: "第14節 (22:30-23:20)" },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 驗證表單
    if (
      !formData.studentId ||
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.department ||
      !formData.room ||
      !date ||
      !formData.startPeriod ||
      !formData.endPeriod
    ) {
      toast({
        title: "缺少資訊",
        description: "請填寫所有必填欄位。",
        variant: "destructive",
      })
      return
    }

    // 驗證結束節次大於開始節次
    if (Number.parseInt(formData.endPeriod) < Number.parseInt(formData.startPeriod)) {
      toast({
        title: "時間錯誤",
        description: "結束節次必須大於或等於開始節次。",
        variant: "destructive",
      })
      return
    }

    // 在實際應用中，您會將此資料提交到後端
    console.log({
      ...formData,
      date: date ? format(date, "yyyy-MM-dd") : null,
    })

    toast({
      title: "預約已提交",
      description: "您的教室預約已成功提交。",
    })

    // 重定向到確認頁面或首頁
    setTimeout(() => router.push("/"), 1500)
  }

  return (
    <>
      <SiteHeader />
      <div className="container mx-auto py-10 min-h-[calc(100vh-64px-88px)]">
        <h1 className="text-3xl font-bold tracking-tight mb-6">預約教室</h1>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>預約詳情</CardTitle>
            <CardDescription>填寫以下表單以預約教室</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* 個人資訊區塊 */}
              <div>
                <h3 className="text-lg font-medium mb-4">申請人資訊</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {/* 預約詳情區塊 */}
              <div>
                <h3 className="text-lg font-medium mb-4">預約詳情</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="room">
                      教室 <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      name="room"
                      value={formData.room}
                      onValueChange={(value) => handleSelectChange("room", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="選擇教室" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a101">A101講堂</SelectItem>
                        <SelectItem value="b205">B205電腦實驗室</SelectItem>
                        <SelectItem value="c103">C103會議室</SelectItem>
                        <SelectItem value="d201">D201研討室</SelectItem>
                        <SelectItem value="e105">E105工作室</SelectItem>
                        <SelectItem value="f302">F302自習室</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>
                      日期 <span className="text-red-500">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "yyyy年MM月dd日") : <span>選擇日期</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startPeriod">
                      開始節次 <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      name="startPeriod"
                      value={formData.startPeriod}
                      onValueChange={(value) => handleSelectChange("startPeriod", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="選擇開始節次" />
                      </SelectTrigger>
                      <SelectContent>
                        {periodOptions.map((period) => (
                          <SelectItem key={period.value} value={period.value}>
                            {period.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endPeriod">
                      結束節次 <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      name="endPeriod"
                      value={formData.endPeriod}
                      onValueChange={(value) => handleSelectChange("endPeriod", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="選擇結束節次" />
                      </SelectTrigger>
                      <SelectContent>
                        {periodOptions.map((period) => (
                          <SelectItem key={period.value} value={period.value}>
                            {period.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* 借用說明區塊 */}
              <div className="space-y-2">
                <Label htmlFor="purpose">借用說明</Label>
                <Textarea
                  id="purpose"
                  name="purpose"
                  placeholder="請簡要描述您的借用目的和活動內容"
                  value={formData.purpose}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <div className="bg-muted p-4 rounded-md text-sm">
                <p className="font-medium mb-2">預約須知：</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>請至少提前3天預約教室</li>
                  <li>預約成功後，請準時使用並在使用後保持教室整潔</li>
                  <li>如需取消預約，請至少提前24小時申請</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push("/")}>
                取消
              </Button>
              <Button type="submit">提交預約</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
      <SiteFooter />
    </>
  )
}
