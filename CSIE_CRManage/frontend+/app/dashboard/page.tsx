"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, DoorOpen, FileCheck, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Sidebar } from "@/components/layout/sidebar"
import { useAuth } from "@/components/auth/auth-provider"
import { RequireAuth } from "@/components/auth/require-auth"

export default function DashboardPage() {
  const { userRole } = useAuth()

  return (
    <RequireAuth>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="flex flex-col gap-6">
              <h1 className="text-3xl font-bold tracking-tight">儀表板</h1>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">可用教室</CardTitle>
                    <DoorOpen className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">總共15間教室</p>
                  </CardContent>
                </Card>
                {userRole === "admin" && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                      <CardTitle className="text-sm font-medium">待審核預約</CardTitle>
                      <FileCheck className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3</div>
                      <p className="text-xs text-muted-foreground">過去24小時內</p>
                    </CardContent>
                  </Card>
                )}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">今日預約</CardTitle>
                    <CalendarDays className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground">5間教室</p>
                  </CardContent>
                </Card>
                {userRole === "admin" && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                      <CardTitle className="text-sm font-medium">使用者數量</CardTitle>
                      <Users className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">120</div>
                      <p className="text-xs text-muted-foreground">本月新增15位</p>
                    </CardContent>
                  </Card>
                )}
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>近期預約</CardTitle>
                    <CardDescription>您最近的教室預約記錄</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">301教室</p>
                          <p className="text-sm text-muted-foreground">2025/05/15 09:00-11:00</p>
                        </div>
                        <Button variant="outline" size="sm">
                          查看詳情
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">205教室</p>
                          <p className="text-sm text-muted-foreground">2025/05/16 13:00-15:00</p>
                        </div>
                        <Button variant="outline" size="sm">
                          查看詳情
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">502教室</p>
                          <p className="text-sm text-muted-foreground">2025/05/18 15:00-17:00</p>
                        </div>
                        <Button variant="outline" size="sm">
                          查看詳情
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>熱門教室</CardTitle>
                    <CardDescription>最常被預約的教室</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-8 bg-primary rounded-full" />
                          <div>
                            <p className="font-medium">301教室</p>
                            <p className="text-sm text-muted-foreground">多媒體教室</p>
                          </div>
                        </div>
                        <p className="font-medium">85%</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-8 bg-primary/80 rounded-full" />
                          <div>
                            <p className="font-medium">502教室</p>
                            <p className="text-sm text-muted-foreground">電腦教室</p>
                          </div>
                        </div>
                        <p className="font-medium">72%</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-8 bg-primary/60 rounded-full" />
                          <div>
                            <p className="font-medium">205教室</p>
                            <p className="text-sm text-muted-foreground">一般教室</p>
                          </div>
                        </div>
                        <p className="font-medium">65%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </RequireAuth>
  )
}
