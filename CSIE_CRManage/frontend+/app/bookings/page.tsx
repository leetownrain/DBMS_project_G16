import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Check, Clock, DoorOpen, History } from "lucide-react"
import { Sidebar } from "@/components/layout/sidebar"

export default function BookingsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <DoorOpen className="w-6 h-6" />
            <span>教室管理系統</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              王小明
            </Button>
            <Button variant="outline" size="sm">
              登出
            </Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        {/* <Sidebar /> */}
        <aside className="w-64 p-4 border-r bg-muted/40 hidden md:block">
          <nav className="space-y-2">
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start">
                <CalendarDays className="w-5 h-5 mr-2" />
                儀表板
              </Button>
            </Link>
            <Link href="/bookings">
              <Button variant="secondary" className="w-full justify-start">
                <Clock className="w-5 h-5 mr-2" />
                預約查詢
              </Button>
            </Link>
            <Link href="/history">
              <Button variant="ghost" className="w-full justify-start">
                {/* <CalendarDays className="w-5 h-5 mr-2" /> */}
                <History className="w-5 h-5 mr-2" />
                歷史記錄
              </Button>
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h1 className="text-3xl font-bold tracking-tight">預約管理</h1>
              <Button>
                <CalendarDays className="w-4 h-4 mr-2" />
                新增預約
              </Button>
            </div>
            <Tabs defaultValue="active">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="active">進行中</TabsTrigger>
                <TabsTrigger value="pending">待審核</TabsTrigger>
                <TabsTrigger value="upcoming">即將到來</TabsTrigger>
              </TabsList>
              <TabsContent value="active" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>301教室</CardTitle>
                    <CardDescription>多媒體教室 - 今日 09:00-11:00</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">預約人</p>
                          <p>王小明</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">用途</p>
                          <p>專題討論</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">參與人數</p>
                          <p>15人</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">狀態</p>
                          <p className="flex items-center text-green-600">
                            <Check className="w-4 h-4 mr-1" />
                            使用中
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline">延長時間</Button>
                        <Button variant="destructive">取消預約</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="pending" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>502教室</CardTitle>
                    <CardDescription>電腦教室 - 2025/05/18 15:00-17:00</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">預約人</p>
                          <p>王小明</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">用途</p>
                          <p>程式設計課程</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">參與人數</p>
                          <p>25人</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">狀態</p>
                          <p className="flex items-center text-yellow-600">
                            <Clock className="w-4 h-4 mr-1" />
                            待審核
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline">修改申請</Button>
                        <Button variant="destructive">取消申請</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="upcoming" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>205教室</CardTitle>
                    <CardDescription>一般教室 - 2025/05/16 13:00-15:00</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">預約人</p>
                          <p>王小明</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">用途</p>
                          <p>小組討論</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">參與人數</p>
                          <p>10人</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">狀態</p>
                          <p className="flex items-center text-blue-600">
                            <Check className="w-4 h-4 mr-1" />
                            已核准
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline">查看詳情</Button>
                        <Button variant="destructive">取消預約</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
