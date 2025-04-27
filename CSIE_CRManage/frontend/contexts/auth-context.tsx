"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// 定義使用者類型
export type UserRole = "admin" | "user"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

// 模擬使用者資料
const mockUsers: User[] = [
  {
    id: "1",
    name: "管理員",
    email: "admin@example.com",
    role: "admin",
  },
  {
    id: "2",
    name: "一般使用者",
    email: "user@example.com",
    role: "user",
  },
  {
    id: "3",
    name: "張小明",
    email: "john@example.com",
    role: "user",
  },
]

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  requestUpgrade: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 啟動時檢查現有會話
  useEffect(() => {
    const storedUser = localStorage.getItem("classroom-reservation-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // 在實際應用中，您會與後端驗證憑證
    // 為了演示目的，我們只檢查模擬資料
    // 密碼在此演示中被忽略

    setIsLoading(true)

    // 模擬網路請求
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())

    if (foundUser) {
      setUser(foundUser)
      // 將使用者保存到localStorage以保持持久性
      localStorage.setItem("classroom-reservation-user", JSON.stringify(foundUser))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("classroom-reservation-user")
  }

  const requestUpgrade = async () => {
    // 在實際應用中，這會向後端發送請求
    // 為了演示，我們只顯示成功訊息
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return true
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, requestUpgrade }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth必須在AuthProvider內使用")
  }
  return context
}
