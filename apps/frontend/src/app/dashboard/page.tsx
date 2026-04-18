"use client"
import axios from "axios"
import Left from "../../../components/dashboardComponent/Left"
import Right from "../../../components/dashboardComponent/Right"
import { useEffect, useState } from "react"
type Room = { id: string; slug: string; adminId: string; createdAt: string }
const page = () => {
    const [rooms, setRooms] = useState<Room[]>([])
    const [ownedRoom, setOwnedRoom] = useState<{roomId:string,slug:string}[]>([])
 const refreshRoom=async() => {
    const token = localStorage.getItem("token")
    if (!token) return
 const [joined, owned] = await Promise.all([
  axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/roomOwned`, {
    headers: { Authorization: `Bearer ${token}` }
  })
])

setRooms(joined.data)
setOwnedRoom(owned.data)
  }
  useEffect(()=>{
  refreshRoom()
  },[])
  return (
    <div className="flex w-screen h-screen bg-stone-100">
      <div className="w-[25%] h-full">
        <Left ownedRoom={ownedRoom} rooms={rooms}  />
      </div>
      <div className="w-[75%] h-full">
        <Right refreshRoom={refreshRoom} />
      </div>
    </div>
  )
}
export default page