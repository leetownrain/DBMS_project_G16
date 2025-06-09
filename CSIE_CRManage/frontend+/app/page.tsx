import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CalendarDays, DoorOpen, Users } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">高效的教室管理系統</h1>
                <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  輕鬆管理教室資源，簡化預約流程，提高空間利用效率
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/timetable">
                  <Button size="lg">查看可用教室</Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline">
                    立即註冊
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <DoorOpen className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">教室管理</h3>
                <p className="text-gray-500">全面管理教室資源，包括教室資訊、設備狀態和容量等</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <CalendarDays className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">時段管理</h3>
                <p className="text-gray-500">靈活設定可預約時段，輕鬆查看各教室的可用時間</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Users className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">預約審核</h3>
                <p className="text-gray-500">完整的預約申請和審核流程，確保資源合理分配</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
