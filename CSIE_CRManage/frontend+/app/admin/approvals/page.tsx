"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X, Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Sidebar } from "@/components/layout/sidebar"
import { RequireAuth } from "@/components/auth/require-auth"

export default function ApprovalsPage() {
  const [viewingBooking, setViewingBooking] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // 模擬預約資料
  const bookings = [
    {
      id: 1,
      user: "王小明",
      email: "wang@example.com",
      classroom: "502教室",
      date: "2025/05/18",
      time: "15:00-17:00",
      purpose: "程式設計課程",
      participants: 25,
      status: "pending",
      createdAt: "2025/05/15 14:30",
    },
    {
      id: 2,
      user: "李小華",
      email: "lee@example.com",
      classroom: "301教室",
      date: "2025/05/20",
      time: "09:00-11:00",
      purpose: "演講活動",
      participants: 40,
      status: "pending",
      createdAt: "2025/05/16 10:15",
    },
    {
      id: 3,
      user: "張小龍",
      email: "zhang@example.com",
      classroom: "402教室",
      date: "2025/05/22",
      time: "13:00-15:00",
      purpose: "實驗課程",
      participants: 20,
      status: "pending",
      createdAt: "2025/05/16 16:45",
    },
  ]

  const handleViewBooking = (booking: any) => {
    setViewingBooking(booking)
    setIsDialogOpen(true)
  }

  const handleApprove = (id: number) => {
    // 模擬核准預約
    console.log(`核准預約 ID: ${id}`)
    // 在實際應用中，這裡應該發送請求到後端API
  }

  const handleReject = (id: number) => {
    // 模擬拒絕預約
    console.log(`拒絕預約 ID: ${id}`)
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
                <h1 className="text-3xl font-bold tracking-tight">預約審核</h1>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>待審核預約</CardTitle>
                  <CardDescription>審核使用者提交的教室預約申請</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>申請人</TableHead>
                        <TableHead>教室</TableHead>
                        <TableHead>日期時間</TableHead>
                        <TableHead>用途</TableHead>
                        <TableHead>人數</TableHead>
                        <TableHead>申請時間</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>{booking.user}</TableCell>
                          <TableCell>{booking.classroom}</TableCell>
                          <TableCell>
                            {booking.date} {booking.time}
                          </TableCell>
                          <TableCell>{booking.purpose}</TableCell>
                          <TableCell>{booking.participants}人</TableCell>
                          <TableCell>{booking.createdAt}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleViewBooking(booking)}>
                                <Eye className="w-4 h-4 mr-1" />
                                查看
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleApprove(booking.id)}>
                                <Check className="w-4 h-4 mr-1" />
                                核准
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-500"
                                onClick={() => handleReject(booking.id)}
                              >
                                <X className="w-4 h-4 mr-1" />
                                拒絕
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
              <DialogTitle>預約詳情</DialogTitle>
              <DialogDescription>查看預約申請的詳細資訊</DialogDescription>
            </DialogHeader>
            {viewingBooking && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">申請人</p>
                    <p>{viewingBooking.user}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">電子郵件</p>
                    <p>{viewingBooking.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">教室</p>
                    <p>{viewingBooking.classroom}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">日期時間</p>
                    <p>
                      {viewingBooking.date} {viewingBooking.time}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">用途</p>
                    <p>{viewingBooking.purpose}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">參與人數</p>
                    <p>{viewingBooking.participants}人</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">申請時間</p>
                    <p>{viewingBooking.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">狀態</p>
                    <p>待審核</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">備註</p>
                  <p className="text-sm text-muted-foreground">
                    申請人表示需要使用投影機和音響系統，並希望能提前15分鐘進入教室準備。
                  </p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                關閉
              </Button>
              <Button
                variant="outline"
                className="text-red-500"
                onClick={() => {
                  handleReject(viewingBooking.id)
                  setIsDialogOpen(false)
                }}
              >
                <X className="w-4 h-4 mr-1" />
                拒絕
              </Button>
              <Button
                onClick={() => {
                  handleApprove(viewingBooking.id)
                  setIsDialogOpen(false)
                }}
              >
                <Check className="w-4 h-4 mr-1" />
                核准
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RequireAuth>
  )
}
