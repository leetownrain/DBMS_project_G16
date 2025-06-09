"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Sidebar } from "@/components/layout/sidebar"
import { RequireAuth } from "@/components/auth/require-auth"

export default function AdminPage() {
  return (
    <RequireAuth adminOnly>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1 className="text-3xl font-bold tracking-tight">管理設定</h1>
              </div>
              <Tabs defaultValue="approvals">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="approvals">預約審核</TabsTrigger>
                  <TabsTrigger value="classrooms">教室管理</TabsTrigger>
                  <TabsTrigger value="users">使用者管理</TabsTrigger>
                </TabsList>
                <TabsContent value="approvals" className="space-y-4 pt-4">
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
                            <TableHead className="text-right">操作</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>王小明</TableCell>
                            <TableCell>502教室</TableCell>
                            <TableCell>2025/05/18 15:00-17:00</TableCell>
                            <TableCell>程式設計課程</TableCell>
                            <TableCell>25人</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="outline">
                                  <Check className="w-4 h-4 mr-1" />
                                  核准
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-500">
                                  <X className="w-4 h-4 mr-1" />
                                  拒絕
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>李小華</TableCell>
                            <TableCell>301教室</TableCell>
                            <TableCell>2025/05/20 09:00-11:00</TableCell>
                            <TableCell>演講活動</TableCell>
                            <TableCell>40人</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="outline">
                                  <Check className="w-4 h-4 mr-1" />
                                  核准
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-500">
                                  <X className="w-4 h-4 mr-1" />
                                  拒絕
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>張小龍</TableCell>
                            <TableCell>402教室</TableCell>
                            <TableCell>2025/05/22 13:00-15:00</TableCell>
                            <TableCell>實驗課程</TableCell>
                            <TableCell>20人</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="outline">
                                  <Check className="w-4 h-4 mr-1" />
                                  核准
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-500">
                                  <X className="w-4 h-4 mr-1" />
                                  拒絕
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="classrooms" className="space-y-4 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>教室管理</CardTitle>
                      <CardDescription>管理系統中的教室資訊</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-end mb-4">
                        <Button>新增教室</Button>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>教室編號</TableHead>
                            <TableHead>名稱</TableHead>
                            <TableHead>類型</TableHead>
                            <TableHead>容納人數</TableHead>
                            <TableHead>設備</TableHead>
                            <TableHead className="text-right">操作</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>301</TableCell>
                            <TableCell>301教室</TableCell>
                            <TableCell>多媒體教室</TableCell>
                            <TableCell>40人</TableCell>
                            <TableCell>投影機, 音響系統, 電腦</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="outline">
                                  編輯
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-500">
                                  刪除
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>302</TableCell>
                            <TableCell>302教室</TableCell>
                            <TableCell>一般教室</TableCell>
                            <TableCell>30人</TableCell>
                            <TableCell>投影機, 白板</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="outline">
                                  編輯
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-500">
                                  刪除
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>401</TableCell>
                            <TableCell>401教室</TableCell>
                            <TableCell>電腦教室</TableCell>
                            <TableCell>50人</TableCell>
                            <TableCell>投影機, 電腦, 網路設備</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="outline">
                                  編輯
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-500">
                                  刪除
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="users" className="space-y-4 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>使用者管理</CardTitle>
                      <CardDescription>管理系統使用者帳號</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-end mb-4">
                        <Button>新增使用者</Button>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>姓名</TableHead>
                            <TableHead>電子郵件</TableHead>
                            <TableHead>角色</TableHead>
                            <TableHead>註冊日期</TableHead>
                            <TableHead className="text-right">操作</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>1</TableCell>
                            <TableCell>王小明</TableCell>
                            <TableCell>wang@example.com</TableCell>
                            <TableCell>使用者</TableCell>
                            <TableCell>2025/01/15</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="outline">
                                  編輯
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-500">
                                  停用
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>2</TableCell>
                            <TableCell>李小華</TableCell>
                            <TableCell>lee@example.com</TableCell>
                            <TableCell>使用者</TableCell>
                            <TableCell>2025/02/20</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="outline">
                                  編輯
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-500">
                                  停用
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>3</TableCell>
                            <TableCell>張小龍</TableCell>
                            <TableCell>zhang@example.com</TableCell>
                            <TableCell>管理員</TableCell>
                            <TableCell>2025/01/10</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="outline">
                                  編輯
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-500">
                                  停用
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </RequireAuth>
  )
}
