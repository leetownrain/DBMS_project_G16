import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ClassroomGrid } from "@/components/classroom-grid"
import { ClassroomCalendar } from "@/components/classroom-calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import  Link  from "next/link"


export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <div className="container mx-auto py-10 min-h-[calc(100vh-64px-88px)]">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">教室借用系統</h1>
            <p className="text-muted-foreground mt-1">瀏覽並借用教室進行您的活動</p>
          </div>
          <Button asChild>
            <Link href="/book">借用教室</Link>
          </Button>
        </header>

        <Tabs defaultValue="grid" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="grid">網格視圖</TabsTrigger>
            <TabsTrigger value="calendar">日曆視圖</TabsTrigger>
          </TabsList>
          <TabsContent value="grid">
            <ClassroomGrid />
          </TabsContent>
          <TabsContent value="calendar">
            <ClassroomCalendar />
          </TabsContent>
        </Tabs>
      </div>
      <SiteFooter />
    </>
  )
}
