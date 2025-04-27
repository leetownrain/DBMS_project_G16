"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

// 模擬預約資料
const initialReservations = [
  {
    id: 1,
    title: "計算機科學101講座",
    room: "a101",
    roomName: "A101講堂",
    building: "A棟",
    floor: "一樓",
    date: "2025-04-14",
    start: "09:00",
    end: "10:30",
    status: "active", // active, completed, cancelled, pending_cancellation
    createdAt: "2025-04-01T10:30:00Z",
  },
  {
    id: 2,
    title: "程式設計實驗",
    room: "b205",
    roomName: "B205電腦實驗室",
    building: "B棟",
    floor: "二樓",
    date: "2025-04-14",
    start: "13:00",
    end: "15:00",
    status: "active",
    createdAt: "2025-04-02T14:15:00Z",
  },
  {
    id: 3,
    title: "部門會議",
    room: "c103",
    roomName: "C103會議室",
    building: "C棟",
    floor: "一樓",
    date: "2025-04-15",
    start: "11:00",
    end: "12:00",
    status: "pending_cancellation",
    createdAt: "2025-04-03T09:45:00Z",
    cancellationReason: "會議已改期至下週",
    cancellationRequestedAt: "2025-04-10T16:30:00Z",
  },
  {
    id: 4,
    title: "物理講座",
    room: "a101",
    roomName: "A101講堂",
    building: "A棟",
    floor: "一樓",
    date: "2025-03-16",
    start: "14:00",
    end: "15:30",
    status: "completed",
    createdAt: "2025-03-05T11:20:00Z",
  },
  {
    id: 5,
    title: "工作坊",
    room: "d201",
    roomName: "D201研討室",
    building: "D棟",
    floor: "二樓",
    date: "2025-03-17",
    start: "10:00",
    end: "12:00",
    status: "cancelled",
    createdAt: "2025-03-06T13:10:00Z",
    cancellationReason: "講師臨時有事無法出席",
    cancellationRequestedAt: "2025-03-15T09:30:00Z",
    cancellationApprovedAt: "2025-03-15T14:45:00Z",
  },
]

export default function MyReservationsPage() {
  return (
    <AuthGuard>
      <SiteHeader />
      <MyReservations />
      <SiteFooter />
    </AuthGuard>
  )
}

function MyReservations() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [reservations, setReservations] = useState(initialReservations)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [cancellationReason, setCancellationReason] = useState("")

  // 獲取當前日期，用於區分即將到來和歷史預約
  const currentDate = new Date()
  const currentDateStr = format(currentDate, "yyyy-MM-dd")

  // 過濾即將到來的預約（日期大於等於今天且狀態不是已完成或已取消）
  const upcomingReservations = reservations.filter(
    (reservation) =>
      reservation.date >= currentDateStr &&
      (reservation.status === "active" || reservation.status === "pending_cancellation"),
  )

  // 過濾歷史預約（日期小於今天或狀態是已完成或已取消）
  const pastReservations = reservations.filter(
    (reservation) =>
      reservation.date < currentDateStr || reservation.status === "completed" || reservation.status === "cancelled",
  )

  const handleCancelRequest = (reservation) => {
    setSelectedReservation(reservation)
    setCancellationReason("")
    setIsCancelDialogOpen(true)
  }

  const handleSubmitCancellation = () => {
    if (!selectedReservation || !cancellationReason.trim()) return

    // 更新預約狀態為取消申請中
    setReservations((prev) =>
      prev.map((res) =>
        res.id === selectedReservation.id
          ? {
              ...res,
              status: "pending_cancellation",
              cancellationReason: cancellationReason,
              cancellationRequestedAt: new Date().toISOString(),
            }
          : res,
      ),
    )

    setIsCancelDialogOpen(false)
    setSelectedReservation(null)

    toast({
      title: "取消申請已提交",
      description: "您的預約取消申請已成功提交，等待管理員審核。",
    })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">進行中</Badge>
      case "completed":
        return (
          <Badge variant="outline" className="text-blue-500">
            已完成
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="text-red-500">
            已取消
          </Badge>
        )
      case "pending_cancellation":
        return (
          <Badge variant="outline" className="text-amber-500">
            取消申請中
          </Badge>
        )
      default:
        return <Badge variant="outline">未知狀態</Badge>
    }
  }

  return (
    <div className="container mx-auto py-10 min-h-[calc(100vh-64px-88px)]">
      <div className="flex items-center mb-8">
        <Calendar className="h-6 w-6 mr-2" />
        <h1 className="text-3xl font-bold tracking-tight">我的預約</h1>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">即將到來的預約</TabsTrigger>
          <TabsTrigger value="past">歷史預約</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingReservations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingReservations.map((reservation) => (
                <Card key={reservation.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle>{reservation.title}</CardTitle>
                    <CardDescription>
                      {reservation.roomName} ({reservation.building}, {reservation.floor})
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">日期</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(reservation.date), "yyyy年MM月dd日")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">時間</p>
                        <p className="text-sm text-muted-foreground">
                          {reservation.start} - {reservation.end}
                        </p>
                      </div>
                    </div>
                    {reservation.status === "pending_cancellation" && (
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 mt-0.5 text-amber-500" />
                        <div>
                          <p className="text-sm font-medium">取消原因</p>
                          <p className="text-sm text-muted-foreground">{reservation.cancellationReason}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between pt-3 border-t">
                    <div>{getStatusBadge(reservation.status)}</div>
                    {reservation.status === "active" && (
                      <Button variant="outline" size="sm" onClick={() => handleCancelRequest(reservation)}>
                        申請取消
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">您沒有即將到來的預約</p>
              <Button className="mt-4" onClick={() => (window.location.href = "/book")}>
                預約教室
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastReservations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastReservations.map((reservation) => (
                <Card key={reservation.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle>{reservation.title}</CardTitle>
                    <CardDescription>
                      {reservation.roomName} ({reservation.building}, {reservation.floor})
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">日期</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(reservation.date), "yyyy年MM月dd日")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">時間</p>
                        <p className="text-sm text-muted-foreground">
                          {reservation.start} - {reservation.end}
                        </p>
                      </div>
                    </div>
                    {reservation.status === "cancelled" && (
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 mt-0.5 text-red-500" />
                        <div>
                          <p className="text-sm font-medium">取消原因</p>
                          <p className="text-sm text-muted-foreground">{reservation.cancellationReason}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between pt-3 border-t">
                    <div>{getStatusBadge(reservation.status)}</div>
                    <Button variant="outline" size="sm" onClick={() => (window.location.href = "/book")}>
                      再次預約
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">您沒有歷史預約記錄</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* 取消預約對話框 */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>申請取消預約</DialogTitle>
            <DialogDescription>請提供取消預約的原因。您的申請將由管理員審核。</DialogDescription>
          </DialogHeader>
          {selectedReservation && (
            <div className="py-4">
              <div className="mb-4 p-3 bg-muted rounded-md">
                <h4 className="font-medium">{selectedReservation.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedReservation.roomName} | {format(new Date(selectedReservation.date), "yyyy年MM月dd日")} |{" "}
                  {selectedReservation.start} - {selectedReservation.end}
                </p>
              </div>
              <div className="space-y-4">
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="cancellation-reason">取消原因</Label>
                  <Textarea
                    id="cancellation-reason"
                    placeholder="請輸入取消預約的原因"
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSubmitCancellation} disabled={!cancellationReason.trim()}>
              提交申請
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
