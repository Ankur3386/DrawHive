"use client"
import axios from "axios"
import { useEffect, useState } from "react"
import { IoAdd } from "react-icons/io5"
import { useRouter, usePathname } from "next/navigation"

type Room = { id: string; slug: string; adminId: string; createdAt: string }

const Right = () => {
  const [search, setSearch] = useState("")
  const [results, setResults] = useState<Room[]>([])
  const [notFound, setNotFound] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [roomName, setRoomName] = useState("")
  const [createError, setCreateError] = useState("")
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setSearch(""); setResults([]); setNotFound(false)
  }, [pathname])

  useEffect(() => {
    if (!search.trim()) { setResults([]); setNotFound(false); return }
    const token = localStorage.getItem("token")
    const delay = setTimeout(() => {
      axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setResults(res.data)
        setNotFound(res.data.length === 0)
      }).catch(() => setNotFound(true))
    }, 500)
    return () => clearTimeout(delay)
  }, [search])

  const handleCreate = async () => {
    if (!roomName.trim()) return
    const token = localStorage.getItem("token")
    setCreateError("")
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room`,
        { name: roomName },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setShowModal(false)
      setRoomName("")
    } catch {
      setCreateError("Room name already taken. Try a different name.")
    }
  }

  return (
    <div className="w-[97%] h-[97%] bg-white rounded-xl m-2 md:m-4 flex flex-col relative shadow-sm">

      {/* Top bar */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-stone-100">
        <p className="text-sm font-semibold text-stone-700">Explore Rooms</p>
        <button onClick={() => setShowModal(true)}
          className="bg-amber-400 hover:bg-amber-500 text-white rounded-lg flex items-center
                     gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors">
          <IoAdd size={16} /> Create New Room
        </button>
      </div>

      {/* Search */}
      <div className="flex justify-center px-6 pt-6 pb-3">
        <div className="relative w-full max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4" stroke="#d6d3d1" strokeWidth="1.4"/>
            <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="#d6d3d1" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <input type="text" placeholder="Search rooms by name…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-stone-200
                       bg-stone-50 text-stone-700 placeholder-stone-300 outline-none
                       focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"/>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        {!search && (
          <p className="text-center text-sm text-stone-300 mt-10">Search for a room to join</p>
        )}
        {search && notFound && (
          <p className="text-center text-sm text-stone-400 mt-6">No room found for "{search}"</p>
        )}
        {results.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
            {results.map(room => (
              <div key={room.id} onClick={() => router.push(`/canvas/${room.id}`)}
                className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex items-center
                           gap-3 cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition-all">
                <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center
                                text-xs font-bold text-amber-600 flex-shrink-0">
                  {room.slug.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-stone-700 truncate">{room.slug}</p>
                  <p className="text-xs text-stone-400">Click to join</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="absolute inset-0 bg-black/25 flex items-center justify-center z-10 rounded-xl">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-lg">
            <h3 className="text-base font-semibold text-stone-800 mb-1">Create a new room</h3>
            <p className="text-xs text-stone-400 mb-4">Give your room a unique name</p>
            <input type="text" placeholder="Room name" value={roomName}
              onChange={e => { setRoomName(e.target.value); setCreateError("") }}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-stone-200 bg-stone-50
                         outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"/>
            {createError && (
              <p className="text-xs text-red-400 mt-2">{createError}</p>
            )}
            <div className="flex gap-2 justify-end mt-4">
              <button onClick={() => { setShowModal(false); setRoomName(""); setCreateError("") }}
                className="px-4 py-1.5 text-sm rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleCreate}
                className="px-4 py-1.5 text-sm rounded-lg bg-amber-400 hover:bg-amber-500 text-white font-medium transition-colors">
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default Right