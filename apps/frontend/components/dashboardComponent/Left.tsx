"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

type Room = { id: string; slug: string; adminId: string; createdAt: string }

const Left = ({ownedRoom,rooms}:{ownedRoom:{roomId:string,slug:string}[],rooms:Room[]}) => {
 const [user, setUser] = useState("")
console.log("rooms:", rooms)
useEffect(() => {
  const storedUser = localStorage.getItem("user")
  if (storedUser) {
    setUser(JSON.parse(storedUser))
  }
}, [])
  return (
    <div className="w-[90%] h-[97%] bg-white rounded-xl m-4 flex flex-col overflow-hidden shadow-sm">

      {/* User header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-stone-100">
        <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center
                        text-xs font-semibold text-white flex-shrink-0">
          {user?.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold text-stone-800 truncate">{user}</p>
          <p className="text-xs text-stone-400">Dashboard</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-3">

        {/* Owned rooms */}
        <div className="flex items-center justify-between px-4 pt-1 pb-2">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest">My Rooms</span>
          <span className="text-[11px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full font-medium">
            {ownedRoom.length}
          </span>
        </div>
        {ownedRoom.length === 0 && (
          <p className="text-center text-xs text-stone-300 py-3">No rooms created yet</p>
        )}
        <div className="max-h-[180px] overflow-y-auto">
          {ownedRoom.map(({roomId,slug}, i) => (
            <div key={i} className="flex items-center gap-3 px-3 mx-2 py-2 rounded-lg
                                    hover:bg-amber-50 cursor-pointer transition-colors group">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center
                              text-xs font-bold text-amber-600 flex-shrink-0">
                {slug.slice(0, 2).toUpperCase()}
              </div>
              <Link href={`/canvas/${slug}/${roomId}`} className="text-sm font-medium text-stone-700 truncate group-hover:text-amber-700 transition-colors">
                {slug}
              </Link >
            </div>
          ))}
        </div>

        <div className="mx-4 my-3 border-t border-stone-100" />

        {/* Joined rooms */}
        <div className="flex items-center justify-between px-4 pt-1 pb-2">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest">Joined</span>
          <span className="text-[11px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full font-medium">
            {rooms.length}
          </span>
        </div>
        {rooms.length === 0 && (
          <p className="text-center text-xs text-stone-300 py-3">No rooms joined yet</p>
        )}
        <div className="max-h-[180px] overflow-y-auto">
          {rooms.map(room => (
            <div key={room.id} className="flex items-center gap-3 px-3 mx-2 py-2 rounded-lg
                                          hover:bg-stone-50 cursor-pointer transition-colors group">
              <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center
                              text-xs font-bold text-stone-500 flex-shrink-0">
                {room.slug.slice(0, 2).toUpperCase()}
              </div>
              <p className="text-sm font-medium text-stone-600 truncate group-hover:text-stone-800 transition-colors">
                {room.slug}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
  
}
export default Left