"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type UserRole = "user" | "admin" | null
type AuthContextType = {
  userRole: UserRole
  userName: string | null
  login: (role: "user" | "admin", name: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({
  userRole: null,
  userName: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // 初始化時從 localStorage 讀取用戶信息
  useEffect(() => {
    const storedRole = localStorage.getItem("userRole") as UserRole
    const storedName = localStorage.getItem("userName")

    if (storedRole && storedName) {
      setUserRole(storedRole)
      setUserName(storedName)
    }

    setIsInitialized(true)
  }, [])

  const login = (role: "user" | "admin", name: string) => {
    setUserRole(role)
    setUserName(name)

    // 將用戶信息存儲到 localStorage
    // localStorage.setItem("userRole", role)
    localStorage.setItem("userName", name)
  }

  const logout = () => {
    setUserRole(null)
    setUserName(null)

    // 清除 localStorage 中的用戶信息
    // localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    localStorage.removeItem("access_token")
  }

  // 在初始化完成前不渲染子組件，避免閃爍
  if (!isInitialized) {
    return null
  }

  return (
    <AuthContext.Provider
      value={{
        userRole,
        userName,
        login,
        logout,
        isAuthenticated: userRole !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
