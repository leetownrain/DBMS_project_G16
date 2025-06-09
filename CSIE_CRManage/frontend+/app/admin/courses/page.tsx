"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileText, Trash2, Edit, Globe, RefreshCw, Calendar } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Sidebar } from "@/components/layout/sidebar"
import { RequireAuth } from "@/components/auth/require-auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

// 時段資料
const timeSlots = [
  { id: 1, name: "第一節", time: "08:00-09:00" },
  { id: 2, name: "第二節", time: "09:00-10:00" },
  { id: 3, name: "第三節", time: "10:00-11:00" },
  { id: 4, name: "第四節", time: "11:00-12:00" },
  { id: 5, name: "中午", time: "12:00-13:00" },
  { id: 6, name: "第五節", time: "13:00-14:00" },
  { id: 7, name: "第六節", time: "14:00-15:00" },
  { id: 8, name: "第七節", time: "15:00-16:00" },
  { id: 9, name: "第八節", time: "16:00-17:00" },
  { id: 10, name: "第九節", time: "17:00-18:00" },
  { id: 11, name: "第十節", time: "18:00-19:00" },
  { id: 12, name: "第十一節", time: "19:00-20:00" },
  { id: 13, name: "第十二節", time: "20:00-21:00" },
  { id: 14, name: "第十三節", time: "21:00-22:00" },
]

// 星期資料
const weekDays = [
  { id: 1, name: "星期一", short: "一" },
  { id: 2, name: "星期二", short: "二" },
  { id: 3, name: "星期三", short: "三" },
  { id: 4, name: "星期四", short: "四" },
  { id: 5, name: "星期五", short: "五" },
  { id: 6, name: "星期六", short: "六" },
  { id: 7, name: "星期日", short: "日" },
]

export default function CoursesManagementPage() {
  const [isCrawlerDialogOpen, setIsCrawlerDialogOpen] = useState(false)
  const [isCrawling, setIsCrawling] = useState(false)
  const [crawlProgress, setCrawlProgress] = useState(0)
  const [crawlStatus, setCrawlStatus] = useState("")
  const [viewMode, setViewMode] = useState<"table" | "schedule">("table")
  const [selectedSemester, setSelectedSemester] = useState("113-2")
  const [selectedDepartment, setSelectedDepartment] = useState("資訊工程系")

  const [importedCourses, setImportedCourses] = useState<any[]>([
    {
      id: 1,
      courseName: "程式設計",
      courseCode: "CS101",
      teacher: "王教授",
      classroom: "301教室",
      dayOfWeek: 1, // 星期一
      startSlot: 1,
      endSlot: 2,
      status: "success",
      importDate: "2025/01/15",
      credits: 3,
      department: "資訊工程系",
    },
    {
      id: 2,
      courseName: "資料結構",
      courseCode: "CS201",
      teacher: "李教授",
      classroom: "301教室",
      dayOfWeek: 1, // 星期一
      startSlot: 6,
      endSlot: 7,
      status: "success",
      importDate: "2025/01/15",
      credits: 3,
      department: "資訊工程系",
    },
    {
      id: 3,
      courseName: "計算機概論",
      courseCode: "CS100",
      teacher: "張教授",
      classroom: "302教室",
      dayOfWeek: 2, // 星期二
      startSlot: 3,
      endSlot: 4,
      status: "success",
      importDate: "2025/01/15",
      credits: 2,
      department: "資訊工程系",
    },
    {
      id: 4,
      courseName: "網路安全",
      courseCode: "CS301",
      teacher: "陳教授",
      classroom: "401教室",
      dayOfWeek: 3, // 星期三
      startSlot: 6,
      endSlot: 8,
      status: "success",
      importDate: "2025/01/15",
      credits: 3,
      department: "資訊工程系",
    },
    {
      id: 5,
      courseName: "人工智慧",
      courseCode: "CS401",
      teacher: "林教授",
      classroom: "501教室",
      dayOfWeek: 4, // 星期四
      startSlot: 1,
      endSlot: 3,
      status: "success",
      importDate: "2025/01/15",
      credits: 3,
      department: "資訊工程系",
    },
  ])

  const handleCrawlCourses = async () => {
    setIsCrawling(true)
    setCrawlProgress(0)
    setCrawlStatus("正在連接課程系統...")

    // 模擬爬蟲過程
    const steps = [
      { progress: 10, status: "正在連接課程系統..." },
      { progress: 25, status: "正在登入系統..." },
      { progress: 40, status: "正在搜尋課程資料..." },
      { progress: 60, status: "正在解析課程資訊..." },
      { progress: 80, status: "正在處理時段資料..." },
      { progress: 95, status: "正在儲存課程資料..." },
      { progress: 100, status: "爬取完成！" },
    ]

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setCrawlProgress(step.progress)
      setCrawlStatus(step.status)
    }

    // 模擬新增爬取到的課程資料
    const newCourses = [
      {
        id: Date.now() + 1,
        courseName: "軟體工程",
        courseCode: "CS302",
        teacher: "吳教授",
        classroom: "302教室",
        dayOfWeek: 2,
        startSlot: 6,
        endSlot: 7,
        status: "success",
        importDate: new Date().toLocaleDateString("zh-TW"),
        credits: 3,
        department: selectedDepartment,
      },
      {
        id: Date.now() + 2,
        courseName: "作業系統",
        courseCode: "CS303",
        teacher: "趙教授",
        classroom: "401教室",
        dayOfWeek: 4,
        startSlot: 6,
        endSlot: 8,
        status: "success",
        importDate: new Date().toLocaleDateString("zh-TW"),
        credits: 3,
        department: selectedDepartment,
      },
      {
        id: Date.now() + 3,
        courseName: "演算法",
        courseCode: "CS202",
        teacher: "孫教授",
        classroom: "501教室",
        dayOfWeek: 5,
        startSlot: 3,
        endSlot: 4,
        status: "success",
        importDate: new Date().toLocaleDateString("zh-TW"),
        credits: 3,
        department: selectedDepartment,
      },
    ]

    setTimeout(() => {
      setImportedCourses((prev) => [...prev, ...newCourses])
      setIsCrawling(false)
      setIsCrawlerDialogOpen(false)
      alert(`成功爬取 ${newCourses.length} 筆課程資料！`)
    }, 500)
  }

  const handleExportCourses = () => {
    const csvContent =
      "課程代碼,課程名稱,授課教師,教室,星期,開始時段,結束時段,學分數,系所,匯入狀態,匯入日期\n" +
      importedCourses
        .map(
          (course) =>
            `${course.courseCode},${course.courseName},${course.teacher},${course.classroom},${weekDays[course.dayOfWeek - 1].name},${timeSlots[course.startSlot - 1].name},${timeSlots[course.endSlot - 1].name},${course.credits},${course.department},${course.status === "success" ? "成功" : "失敗"},${course.importDate}`,
        )
        .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "課程資料.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDeleteCourse = (id: number) => {
    if (confirm("確定要刪除這筆課程資料嗎？")) {
      setImportedCourses((prev) => prev.filter((course) => course.id !== id))
    }
  }

  const handleDeleteAll = () => {
    if (confirm("確定要刪除所有課程資料嗎？此操作無法復原。")) {
      setImportedCourses([])
    }
  }

  // 生成課表視圖的課程資料
  const getScheduleCourse = (dayId: number, slotId: number) => {
    return importedCourses.find(
      (course) =>
        course.dayOfWeek === dayId &&
        slotId >= course.startSlot &&
        slotId <= course.endSlot &&
        course.status === "success",
    )
  }

  const successCourses = importedCourses.filter((course) => course.status === "success")
  const errorCourses = importedCourses.filter((course) => course.status === "error")

  return (
    <RequireAuth adminOnly>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1 className="text-3xl font-bold tracking-tight">課程管理</h1>
                <div className="flex flex-col gap-2 md:flex-row">
                  <Button onClick={() => setIsCrawlerDialogOpen(true)}>
                    <Globe className="w-4 h-4 mr-2" />
                    爬取課程資料
                  </Button>
                  {importedCourses.length > 0 && (
                    <Button variant="outline" onClick={handleExportCourses}>
                      <Download className="w-4 h-4 mr-2" />
                      匯出資料
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">總課程數</CardTitle>
                    <FileText className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{importedCourses.length}</div>
                    <p className="text-xs text-muted-foreground">已爬取課程</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">成功爬取</CardTitle>
                    <FileText className="w-4 h-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{successCourses.length}</div>
                    <p className="text-xs text-muted-foreground">爬取成功</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">爬取失敗</CardTitle>
                    <FileText className="w-4 h-4 text-red-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">{errorCourses.length}</div>
                    <p className="text-xs text-muted-foreground">需要處理</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>課程資料</CardTitle>
                      <CardDescription>查看和管理已爬取的課程資料</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "table" | "schedule")}>
                        <TabsList>
                          <TabsTrigger value="table">列表檢視</TabsTrigger>
                          <TabsTrigger value="schedule">課表檢視</TabsTrigger>
                        </TabsList>
                      </Tabs>
                      {importedCourses.length > 0 && (
                        <Button variant="destructive" size="sm" onClick={handleDeleteAll}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          清空所有資料
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {viewMode === "table" ? (
                    <Tabs defaultValue="all">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="all">全部 ({importedCourses.length})</TabsTrigger>
                        <TabsTrigger value="success">成功 ({successCourses.length})</TabsTrigger>
                        <TabsTrigger value="error">失敗 ({errorCourses.length})</TabsTrigger>
                      </TabsList>
                      <TabsContent value="all" className="mt-4">
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>課程代碼</TableHead>
                                <TableHead>課程名稱</TableHead>
                                <TableHead>授課教師</TableHead>
                                <TableHead>教室</TableHead>
                                <TableHead>星期</TableHead>
                                <TableHead>時段</TableHead>
                                <TableHead>學分</TableHead>
                                <TableHead>系所</TableHead>
                                <TableHead>狀態</TableHead>
                                <TableHead className="text-right">操作</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {importedCourses.map((course) => (
                                <TableRow key={course.id}>
                                  <TableCell className="font-medium">{course.courseCode}</TableCell>
                                  <TableCell>{course.courseName}</TableCell>
                                  <TableCell>{course.teacher}</TableCell>
                                  <TableCell>{course.classroom}</TableCell>
                                  <TableCell>{weekDays[course.dayOfWeek - 1].name}</TableCell>
                                  <TableCell>
                                    {timeSlots[course.startSlot - 1].name}
                                    {course.startSlot !== course.endSlot && ` - ${timeSlots[course.endSlot - 1].name}`}
                                  </TableCell>
                                  <TableCell>{course.credits}</TableCell>
                                  <TableCell>{course.department}</TableCell>
                                  <TableCell>
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs ${
                                        course.status === "success"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-red-100 text-red-800"
                                      }`}
                                    >
                                      {course.status === "success" ? "成功" : "失敗"}
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <Button size="sm" variant="outline">
                                        <Edit className="w-4 h-4 mr-1" />
                                        編輯
                                      </Button>
                                      <Button size="sm" variant="outline" onClick={() => handleDeleteCourse(course.id)}>
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        刪除
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TabsContent>
                      <TabsContent value="success" className="mt-4">
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>課程代碼</TableHead>
                                <TableHead>課程名稱</TableHead>
                                <TableHead>授課教師</TableHead>
                                <TableHead>教室</TableHead>
                                <TableHead>星期</TableHead>
                                <TableHead>時段</TableHead>
                                <TableHead>學分</TableHead>
                                <TableHead>系所</TableHead>
                                <TableHead className="text-right">操作</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {successCourses.map((course) => (
                                <TableRow key={course.id}>
                                  <TableCell className="font-medium">{course.courseCode}</TableCell>
                                  <TableCell>{course.courseName}</TableCell>
                                  <TableCell>{course.teacher}</TableCell>
                                  <TableCell>{course.classroom}</TableCell>
                                  <TableCell>{weekDays[course.dayOfWeek - 1].name}</TableCell>
                                  <TableCell>
                                    {timeSlots[course.startSlot - 1].name}
                                    {course.startSlot !== course.endSlot && ` - ${timeSlots[course.endSlot - 1].name}`}
                                  </TableCell>
                                  <TableCell>{course.credits}</TableCell>
                                  <TableCell>{course.department}</TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <Button size="sm" variant="outline">
                                        <Edit className="w-4 h-4 mr-1" />
                                        編輯
                                      </Button>
                                      <Button size="sm" variant="outline" onClick={() => handleDeleteCourse(course.id)}>
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        刪除
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TabsContent>
                      <TabsContent value="error" className="mt-4">
                        <div className="text-center py-8 text-muted-foreground">目前沒有爬取失敗的課程資料</div>
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm font-medium">課表檢視</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          顯示 {successCourses.length} 門課程的時段安排
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[100px]">時段</TableHead>
                              {weekDays.slice(0, 5).map((day) => (
                                <TableHead key={day.id} className="text-center min-w-[150px]">
                                  {day.name}
                                </TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {timeSlots.slice(0, 12).map((slot) => (
                              <TableRow key={slot.id}>
                                <TableCell className="font-medium text-center">
                                  <div>{slot.name}</div>
                                  <div className="text-xs text-muted-foreground">{slot.time}</div>
                                </TableCell>
                                {weekDays.slice(0, 5).map((day) => {
                                  const course = getScheduleCourse(day.id, slot.id)
                                  return (
                                    <TableCell key={day.id} className="p-1">
                                      {course ? (
                                        <div className="bg-blue-100 text-blue-800 p-2 rounded text-xs">
                                          <div className="font-medium">{course.courseName}</div>
                                          <div>{course.teacher}</div>
                                          <div>{course.classroom}</div>
                                        </div>
                                      ) : (
                                        <div className="h-16 bg-gray-50 rounded"></div>
                                      )}
                                    </TableCell>
                                  )
                                })}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
        <Footer />

        <Dialog open={isCrawlerDialogOpen} onOpenChange={setIsCrawlerDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                爬取課程資料
              </DialogTitle>
              <DialogDescription>設定爬蟲參數並開始爬取課程資料</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="semester">學期</Label>
                  <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇學期" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="113-1">113學年度第1學期</SelectItem>
                      <SelectItem value="113-2">113學年度第2學期</SelectItem>
                      <SelectItem value="114-1">114學年度第1學期</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">系所</Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇系所" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="資訊工程系">資訊工程系</SelectItem>
                      <SelectItem value="電機工程系">電機工程系</SelectItem>
                      <SelectItem value="機械工程系">機械工程系</SelectItem>
                      <SelectItem value="化學工程系">化學工程系</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="target-url">目標網址</Label>
                <Input
                  id="target-url"
                  placeholder="https://course.example.edu.tw/..."
                  defaultValue="https://course.example.edu.tw/course/query"
                />
              </div>
              {isCrawling && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span className="text-sm">{crawlStatus}</span>
                  </div>
                  <Progress value={crawlProgress} className="w-full" />
                  <div className="text-xs text-muted-foreground text-right">{crawlProgress}%</div>
                </div>
              )}
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-2">爬蟲說明：</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>系統將自動連接到課程查詢系統</li>
                  <li>爬取指定學期和系所的課程資料</li>
                  <li>包含課程名稱、教師、教室、時段等資訊</li>
                  <li>爬取過程可能需要1-2分鐘</li>
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCrawlerDialogOpen(false)} disabled={isCrawling}>
                取消
              </Button>
              <Button onClick={handleCrawlCourses} disabled={isCrawling}>
                {isCrawling ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    爬取中...
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4 mr-2" />
                    開始爬取
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RequireAuth>
  )
}
