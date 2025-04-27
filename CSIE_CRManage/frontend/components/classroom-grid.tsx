"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, Clock, MapPin, Search, Users } from "lucide-react"

// 教室的模擬資料
const classrooms = [
  {
    id: "a101",
    name: "A101講堂",
    description: "配備多媒體設備的大型講堂",
    location: "A棟, 一樓",
    capacity: 120,
    hours: "8:00 AM - 8:00 PM",
    days: "週一至週五",
    features: ["投影機", "音響系統", "白板", "講台"],
    type: "lecture",
  },
  {
    id: "b205",
    name: "B205電腦實驗室",
    description: "30個工作站配備專業軟體",
    location: "B棟, 二樓",
    capacity: 30,
    hours: "9:00 AM - 6:00 PM",
    days: "週一至週六",
    features: ["電腦", "投影機", "白板", "列印站"],
    type: "lab",
  },
  {
    id: "c103",
    name: "C103會議室",
    description: "配備視訊會議設備的會議室",
    location: "C棟, 一樓",
    capacity: 20,
    hours: "8:00 AM - 9:00 PM",
    days: "全週",
    features: ["視訊會議", "白板", "電視螢幕"],
    type: "conference",
  },
  {
    id: "d201",
    name: "D201研討室",
    description: "中型研討會和工作坊用房間",
    location: "D棟, 二樓",
    capacity: 40,
    hours: "8:00 AM - 7:00 PM",
    days: "週一至週五",
    features: ["投影機", "白板", "可移動桌子"],
    type: "seminar",
  },
  {
    id: "e105",
    name: "E105工作室",
    description: "藝術和設計專案的創意空間",
    location: "E棟, 一樓",
    capacity: 25,
    hours: "9:00 AM - 8:00 PM",
    days: "週一至週六",
    features: ["藝術用品", "畫架", "水槽", "儲物空間"],
    type: "studio",
  },
  {
    id: "f302",
    name: "F302自習室",
    description: "小型團體學習用房間",
    location: "F棟, 三樓",
    capacity: 8,
    hours: "24/7",
    days: "全週",
    features: ["白板", "電源插座", "Wi-Fi"],
    type: "study",
  },
]

export function ClassroomGrid() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roomType, setRoomType] = useState("all")

  const filteredClassrooms = classrooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = roomType === "all" || room.type === roomType

    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜尋教室..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={roomType} onValueChange={setRoomType}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="教室類型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">所有類型</SelectItem>
            <SelectItem value="lecture">講堂</SelectItem>
            <SelectItem value="lab">電腦實驗室</SelectItem>
            <SelectItem value="conference">會議室</SelectItem>
            <SelectItem value="seminar">研討室</SelectItem>
            <SelectItem value="studio">工作室</SelectItem>
            <SelectItem value="study">自習室</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClassrooms.length > 0 ? (
          filteredClassrooms.map((room) => (
            <Card key={room.id}>
              <CardHeader>
                <CardTitle>{room.name}</CardTitle>
                <CardDescription>{room.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src={`/placeholder.svg?height=200&width=400&text=${room.name}`}
                  alt={room.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{room.location}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>容納人數: {room.capacity}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{room.hours}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{room.days}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">設施:</h4>
                  <div className="flex flex-wrap gap-2">
                    {room.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/book?room=${room.id}`}>立即預約</Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <h3 className="text-lg font-medium">找不到教室</h3>
            <p className="text-muted-foreground">請調整搜尋條件</p>
          </div>
        )}
      </div>
    </div>
  )
}
