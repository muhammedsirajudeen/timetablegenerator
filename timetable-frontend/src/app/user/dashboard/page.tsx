"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Calendar} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import toast, { Toaster } from "react-hot-toast"

export default function UserDashboard() {
  const router = useRouter()
  const semesters = [3, 4, 5, 6, 7, 8]
  const [userDetails, setUserDetails] = useState()
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("access_token")
    if (token) {
      setUserDetails({ loggedIn: true })
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    setUserDetails(null)
    router.push("/user/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Navigation */}
      <motion.nav
        className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }}>
                <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                  Q
                </div>
                <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Quickshed
                </span>
              </motion.div>
            </div>
            <div className="flex items-center gap-2">
              {userDetails ? (
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button onClick={handleLogout} variant="ghost" className="font-medium">
                    Logout
                  </Button>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button
                    onClick={() => router.push("/user/auth/login")}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                  >
                    Login
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="p-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Semester Timetables</h1>
            <p className="text-gray-600 mt-2">Select a semester to view its class schedule</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {semesters.map((semester) => (
              <motion.div key={semester} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => router.push(`/user/semester/${semester}`)}>
                  <CardContent className="p-6 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 mt-2">
                      <Calendar className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-center">Semester {semester}</h3>
                    <p className="text-sm text-gray-500 text-center mt-1">View timetable</p>
                    <Button variant="ghost" className="mt-4 text-blue-600">
                      Open
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
      <Toaster position="top-right" />
    </div>
  )
}