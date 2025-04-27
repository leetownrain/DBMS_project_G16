"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthGuard } from "@/components/auth-guard"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PendingBookingsTab } from "@/components/admin/pending-bookings-tab"
import { AccessRequestsTab } from "@/components/admin/access-requests-tab"
import { CancellationRequestsTab } from "@/components/admin/cancellation-requests-tab"
import { UsersManagementTab } from "@/components/admin/users-management-tab"
import { ClassroomsManagementTab } from "@/components/admin/classrooms-management-tab"
import { TimePeriodsManagementTab } from "@/components/admin/time-periods-management-tab"
import { AdminProvider } from "@/contexts/admin-context"

export default function AdminPage() {
  return (
    <AuthGuard requireAdmin={true}>
      <SiteHeader />
      <AdminDashboard />
      <SiteFooter />
    </AuthGuard>
  )
}

function AdminDashboard() {
  return (
    <div className="container mx-auto py-10 min-h-[calc(100vh-64px-88px)]">
      <h1 className="text-3xl font-bold tracking-tight mb-2">管理員儀表板</h1>
      <p className="text-muted-foreground mb-8">管理預約、用戶和教室</p>

      <AdminProvider>
        <Tabs defaultValue="pending">
          <TabsList className="mb-4 flex flex-wrap">
            <TabsTrigger value="pending">待處理預約</TabsTrigger>
            <TabsTrigger value="requests">權限請求</TabsTrigger>
            <TabsTrigger value="cancellations">取消申請</TabsTrigger>
            <TabsTrigger value="users">用戶管理</TabsTrigger>
            <TabsTrigger value="classrooms">教室管理</TabsTrigger>
            <TabsTrigger value="timeperiods">時段管理</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>待處理預約</CardTitle>
                <CardDescription>批准或拒絕預約請求</CardDescription>
              </CardHeader>
              <CardContent>
                <PendingBookingsTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>權限請求</CardTitle>
                <CardDescription>管理管理員權限請求</CardDescription>
              </CardHeader>
              <CardContent>
                <AccessRequestsTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cancellations">
            <Card>
              <CardHeader>
                <CardTitle>取消申請</CardTitle>
                <CardDescription>管理用戶的預約取消申請</CardDescription>
              </CardHeader>
              <CardContent>
                <CancellationRequestsTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>用戶管理</CardTitle>
                <CardDescription>管理系統用戶和權限</CardDescription>
              </CardHeader>
              <CardContent>
                <UsersManagementTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classrooms">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>教室管理</CardTitle>
                  <CardDescription>管理系統中的教室</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <ClassroomsManagementTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeperiods">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>時段管理</CardTitle>
                  <CardDescription>管理課節時段和午休時間</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <TimePeriodsManagementTab />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </AdminProvider>
    </div>
  )
}
