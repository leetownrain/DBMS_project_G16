"use client"

import { useState, useEffect } from "react"
import { Clock, Edit, Trash, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
// import { useAdmin } from "@/contexts/admin-context"
import { useMobile } from "@/hooks/use-mobile"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { TimePeriodDialog } from "@/components/admin/dialogs/time-period-dialog"
import { API } from "@/lib/api"

interface Section {
  id: number
  name: string
  start_time: string
  end_time: string
}

export function TimePeriodsManagementTab() {
  const [sections, setSections] = useState<Section[]>([])
  // const { timePeriods, deleteTimePeriod } = useAdmin()
  const isMobile = useMobile()
  const [isAddTimePeriodOpen, setIsAddTimePeriodOpen] = useState(false)
  const [isEditTimePeriodOpen, setIsEditTimePeriodOpen] = useState(false)
  const [currentTimePeriod, setCurrentTimePeriod] = useState<any>(null)

  const fetchSections = async () => {
    try {
      const res = await fetch(API.section.get_all_info, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      if (!res.ok) throw new Error("無法取得時段資料")
      const data = await res.json()
      data.map((item: Section)=>{
        item.start_time= item.start_time.split(":").slice(0, 2).join(":")
        item.end_time= item.end_time.split(":").slice(0, 2).join(":")
      })
      console.log("時段資料：", data)
      setSections(data)
    } catch (error) {
      console.error("載入時段失敗：", error)
    }
  }

  useEffect(() => {
    fetchSections()
  }, [])

  const handleAddTimePeriod = () => {
    setIsAddTimePeriodOpen(true)
  }

  const handleEditTimePeriod = (section: Section) => {
    setCurrentTimePeriod(section)
    setIsEditTimePeriodOpen(true)
  }

  const handleDeleteTimePeriod = (id: number) => {
    if (confirm("確定要刪除此時段嗎？")) {
      // deleteTimePeriod(id)
    }
  }

  return (
    <>
      {isMobile ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">時段列表</h3>
            <Button size="sm" onClick={handleAddTimePeriod}>
              <Plus className="h-4 w-4 mr-1" />
              添加
            </Button>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {sections.map((period) => (
              <AccordionItem key={period.id} value={period.id.toString()}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="font-medium">{period.name}</div>
                    <div>
                      {true ? (
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
                        <p className="text-sm font-medium text-muted-foreground">開始時間</p>
                        <p>{period.start_time}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">結束時間</p>
                        <p>{period.end_time}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">可用日</p>
                      {/* <p>{period.daysAvailable.join(", ")}</p> */}
                      <p>AAA</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">描述</p>
                      {/* <p className="text-sm">{period.description}</p> */}
                      <p className="text-sm">描述</p>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditTimePeriod(period)}>
                        <Edit className="h-4 w-4 mr-1" />
                        編輯
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDeleteTimePeriod(period.id)}
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        刪除
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <Button onClick={handleAddTimePeriod}>
              <Clock className="mr-2 h-4 w-4" />
              添加時段
            </Button>
          </div>
          <div className="border rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-6 font-medium p-3 border-b">
              <div>ID</div>
              <div>名稱</div>
              <div>時間</div>
              {/* <div>可用日</div> */}
              {/* <div>狀態</div> */}
              <div>操作</div>
            </div>

            <div className="divide-y">
              {sections.map((period) => (
                <div key={period.id} className="grid grid-cols-1 md:grid-cols-6 p-3 items-center">
                  <div className="font-medium">{period.id}</div>
                  <div className="text-sm">{period.name}</div>
                  <div className="text-sm">
                    {period.start_time} - {period.end_time}
                  </div>
                  {/* <div className="text-sm">
                    <span className="inline-block max-w-[200px] truncate">{period.daysAvailable.join(", ")}</span>
                  </div> */}
                  {/* <div>
                    {true ? (
                      <Badge className="bg-green-500">啟用</Badge>
                    ) : (
                      <Badge variant="outline" className="text-red-500">
                        停用
                      </Badge>
                    )}
                  </div> */}
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEditTimePeriod(period)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only md:not-sr-only md:ml-2">編輯</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleDeleteTimePeriod(period.id)}
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only md:not-sr-only md:ml-2">刪除</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 添加時段對話框 */}
      <TimePeriodDialog open={isAddTimePeriodOpen} onOpenChange={setIsAddTimePeriodOpen} timePeriod={null} mode="add" />

      {/* 編輯時段對話框 */}
      <TimePeriodDialog
        open={isEditTimePeriodOpen}
        onOpenChange={setIsEditTimePeriodOpen}
        timePeriod={currentTimePeriod}
        mode="edit"
      />
    </>
  )
}
