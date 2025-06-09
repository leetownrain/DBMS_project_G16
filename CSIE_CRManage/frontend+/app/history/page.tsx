"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Sidebar } from "@/components/layout/sidebar"
import { RequireAuth } from "@/components/auth/require-auth"

export default function HistoryPage() {
  return (
    <RequireAuth>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1 className="text-3xl font-bold tracking-tight">歷史記錄</h1>
                <div className="flex flex-col gap-4 md:flex-row">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="搜尋教室或用途..."
                      className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full md:w-[150px]">
                      <SelectValue placeholder="狀態" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">所有狀態</SelectItem>
                      <SelectItem value="approved">已核准</SelectItem>
                      <SelectItem value="rejected">已拒絕</SelectItem>
                      <SelectItem value="cancelled">已取消</SelectItem>
                      <SelectItem value="completed">已完成</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    room: "301教室",
                    type: "多媒體教室",
                    date: "2025/05/10",
                    time: "09:00-11:00",
                    purpose: "專題討論",
                    status: "completed",
                  },
                  {
                    id: 2,
                    room: "402教室",
                    type: "實驗室",
                    date: "2025/05/08",
                    time: "13:00-15:00",
                    purpose: "實驗課程",
                    status: "completed",
                  },
                  {
                    id: 3,
                    room: "501教室",
                    type: "多媒體教室",
                    date: "2025/05/05",
                    time: "15:00-17:00",
                    purpose: "演講活動",
                    status: "completed",
                  },
                  {
                    id: 4,
                    room: "302教室",
                    type: "一般教室",
                    date: "2025/05/03",
                    time: "10:00-12:00",
                    purpose: "小組討論",
                    status: "cancelled",
                  },
                  {
                    id: 5,
                    room: "401教室",
                    type: "電腦教室",
                    date: "2025/04/28",
                    time: "14:00-16:00",
                    purpose: "程式設計課程",
                    status: "rejected",
                  },
                ].map((booking) => (
                  <Card key={booking.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{booking.room}</CardTitle>
                          <CardDescription>
                            {booking.type} - {booking.date} {booking.time}
                          </CardDescription>
                        </div>
                        <div>
                          {booking.status === "completed" && (
                            <span className="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              <Check className="w-3 h-3 mr-1" />
                              已完成
                            </span>
                          )}
                          {booking.status === "cancelled" && (
                            <span className="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                              <X className="w-3 h-3 mr-1" />
                              已取消
                            </span>
                          )}
                          {booking.status === "rejected" && (
                            <span className="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                              <X className="w-3 h-3 mr-1" />
                              已拒絕
                            </span>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">用途</p>
                          <p>{booking.purpose}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">申請日期</p>
                          <p>
                            {booking.date.split("/")[0]}/{booking.date.split("/")[1]}/
                            {Number.parseInt(booking.date.split("/")[2]) - 2}
                          </p>
                        </div>
                        <div className="flex justify-end md:col-span-1">
                          <Button variant="outline" size="sm">
                            查看詳情
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </RequireAuth>
  )
}
