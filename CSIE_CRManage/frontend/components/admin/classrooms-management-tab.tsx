"use client"

import { useState, useEffect } from "react"
import { Building, Edit, Trash, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAdmin } from "@/contexts/admin-context"
import { useMobile } from "@/hooks/use-mobile"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ClassroomDialog } from "@/components/admin/dialogs/classroom-dialog"
import { API } from "@/lib/api"

interface Classroom {
  id: string
  name: string
  description: string
  location: string
  capacity: number
  type: string
  isActive: boolean
}

export function ClassroomsManagementTab() {
  // const { classrooms, deleteClassroom } = useAdmin()
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const isMobile = useMobile()
  const [isAddClassroomOpen, setIsAddClassroomOpen] = useState(false)
  const [isEditClassroomOpen, setIsEditClassroomOpen] = useState(false)
  const [currentClassroom, setCurrentClassroom] = useState<any>(null)

  const fetchClassrooms = async () => {
    try {
      const res = await fetch(API.classroom.get_all_info, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      if (!res.ok) throw new Error("無法取得教室資料")
      const data = await res.json()
      // console.log("教室資料：", data)
      setClassrooms(data)
    } catch (error) {
      console.error("載入教室失敗：", error)
    }
  }

  useEffect(() => {
    fetchClassrooms()
  }, [])

  useEffect(() => {
    console.log("目前的教室清單：", classrooms)
  }, [classrooms])

  const handleAddClassroom = () => {
    setIsAddClassroomOpen(true)
  }

  const handleEditClassroom = (classroom: Classroom) => {
    setCurrentClassroom(classroom)
    setIsEditClassroomOpen(true)
  }

  // const handleDeleteClassroom = (id : string) => {
  //   if (confirm("確定要刪除此教室嗎？")) {
  //     deleteClassroom(id)
  //   }
  // }

  // 渲染教室管理的手機版手風琴視圖
  const renderClassroomAccordion = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">教室列表</h3>
          <Button size="sm" onClick={handleAddClassroom}>
            <Plus className="h-4 w-4 mr-1" />
            添加
          </Button>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {classrooms.map((classroom) => (
            <AccordionItem key={classroom.id} value={classroom.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center">
                    <span className="font-medium">{classroom.name}</span>
                  </div>
                  <div>
                    {classroom.isActive ? (
                      <Badge className="bg-green-500">啟用</Badge>
                    ) : (
                      <Badge variant="outline" className="text-red-500">
                        停用
                      </Badge>
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">ID</p>
                      <p>{classroom.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">容量</p>
                      <p>{classroom.capacity} 人</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">位置</p>
                    <p>{classroom.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">描述</p>
                    <p className="text-sm">{classroom.description}</p>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditClassroom(classroom)}>
                      <Edit className="h-4 w-4 mr-1" />
                      編輯
                    </Button>
                    {/* <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleDeleteClassroom(classroom.id)}
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      刪除
                    </Button> */}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    )
  }

  // 渲染教室管理的桌面版表格視圖
  const renderClassroomTable = () => {
    return (
      <>
        <div className="flex justify-end mb-4">
          <Button onClick={handleAddClassroom}>
            <Building className="mr-2 h-4 w-4" />
            添加教室
          </Button>
        </div>
        <div className="border rounded-md">
          <div className="grid grid-cols-5 font-medium p-3 border-b">
            <div>ID</div>
            <div>名稱</div>
            <div>容量</div>
            <div>狀態</div>
            <div>操作</div>
          </div>

          <div className="divide-y">
            {classrooms.map((classroom) => (
              <div key={classroom.id} className="grid grid-cols-5 p-3 items-center">
                <div className="font-medium">{classroom.id}</div>
                <div className="text-sm">{classroom.name}</div>
                <div className="text-sm">{30}</div>
                <div>
                  {classroom.isActive ? (
                    <Badge className="bg-green-500">啟用</Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-500">
                      停用
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEditClassroom(classroom)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only md:not-sr-only md:ml-2">編輯</span>
                  </Button>
                  {/* <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => handleDeleteClassroom(classroom.id)}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only md:not-sr-only md:ml-2">刪除</span>
                  </Button> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {isMobile ? renderClassroomAccordion() : renderClassroomTable()}

      {/* 添加教室對話框 */}
      <ClassroomDialog
        open={isAddClassroomOpen} 
        onOpenChange={setIsAddClassroomOpen} 
        classroom={null} 
        mode="add" 
        onSubmitSuccess={fetchClassrooms}
      />

      {/* 編輯教室對話框 */}
      <ClassroomDialog
        open={isEditClassroomOpen}
        onOpenChange={setIsEditClassroomOpen}
        classroom={currentClassroom}
        mode="edit"
        onSubmitSuccess={fetchClassrooms}
      />
    </>
  )
}
