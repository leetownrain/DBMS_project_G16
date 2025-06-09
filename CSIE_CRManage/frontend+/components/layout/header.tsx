import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"

export function Header() {
  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-6">
        <MainNav />
        <UserNav />
      </div>
    </header>
  )
}
