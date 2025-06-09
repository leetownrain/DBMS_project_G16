import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ShieldAlert } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-6 p-8">
          <div className="flex justify-center">
            <ShieldAlert className="h-24 w-24 text-red-500" />
          </div>
          <h1 className="text-4xl font-bold">無權限訪問</h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            您沒有權限訪問此頁面。如果您認為這是錯誤，請聯繫系統管理員。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg">返回首頁</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg">
                返回儀表板
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
