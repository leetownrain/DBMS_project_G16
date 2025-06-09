"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Users } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Sidebar } from "@/components/layout/sidebar"
import { RequireAuth } from "@/components/auth/require-auth"
import { useRouter } from "next/navigation"

export default function ClassroomsPage() {
  const router = useRouter()

  const handleBookNow = (classroomId: string) => {
    router.push(`/bookings/new?classroom=${classroomId}`)
  }

  return (
    <RequireAuth>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1 className="text-3xl font-bold tracking-tight">教室列表</h1>
                <div className="flex flex-col gap-4 md:flex-row">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="搜尋教室..." className="pl-8 w-full md:w-[200px] lg:w-[300px]" />
                  </div>
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    id: "301",
                    name: "301教室",
                    capacity: 40,
                    equipment: "投影機, 音響系統, 電腦",
                    available: true,
                  },
                  {
                    id: "302",
                    name: "302教室",
                    capacity: 30,
                    equipment: "投影機, 白板",
                    available: true,
                  },
                  {
                    id: "303",
                    name: "303教室",
                    capacity: 30,
                    equipment: "投影機, 白板",
                    available: false,
                  },
                  {
                    id: "401",
                    name: "401教室",
                    capacity: 50,
                    equipment: "投影機, 電腦, 網路設備",
                    available: true,
                  },
                  {
                    id: "402",
                    name: "402教室",
                    capacity: 25,
                    equipment: "實驗設備, 投影機",
                    available: true,
                  },
                  {
                    id: "501",
                    name: "501教室",
                    capacity: 60,
                    equipment: "投影機, 音響系統, 電腦, 視訊會議設備",
                    available: false,
                  },
                ].map((classroom) => (
                  <Card key={classroom.id} className={classroom.available ? "" : "opacity-70"}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{classroom.name}</span>
                        {classroom.available ? (
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
                            可預約
                          </span>
                        ) : (
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-800">
                            已預約
                          </span>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">容納人數:</span>
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {classroom.capacity}人
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-medium">設備:</span>
                          <span>{classroom.equipment}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        disabled={!classroom.available}
                        onClick={() => classroom.available && handleBookNow(classroom.id)}
                      >
                        {classroom.available ? "預約教室" : "無法預約"}
                      </Button>
                    </CardFooter>
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
