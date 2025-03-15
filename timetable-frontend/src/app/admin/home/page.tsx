"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Calendar, BookOpen, Users, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function AdminDashboard() {
  const router = useRouter()
  const semesters = [2, 3, 4, 5, 6]

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    router.push("/admin/auth/login")
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar onLogout={handleLogout} />

      {/* Main Content */}
      <main className="ml-64 flex-1 p-6 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Teachers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-500 mr-3" />
                  <span className="text-3xl font-bold">12</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Subjects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-indigo-500 mr-3" />
                  <span className="text-3xl font-bold">24</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Timetables Generated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-purple-500 mr-3" />
                  <span className="text-3xl font-bold">5</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Semester Timetables</CardTitle>
              <CardDescription>Select a semester to view or generate its timetable</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {semesters.map((semester) => (
                  <motion.div key={semester} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Card
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => router.push(`/admin/semester/${semester}`)}
                    >
                      <CardContent className="p-6 flex flex-col items-center justify-center">
                        <Clock className="h-12 w-12 text-blue-600 mb-2" />
                        <h3 className="text-xl font-semibold text-center">Semester {semester}</h3>
                        <p className="text-sm text-gray-500 text-center mt-1">View and manage timetable</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <p className="text-sm">Timetable for Semester 3 was generated</p>
                  <span className="ml-auto text-xs text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <p className="text-sm">New teacher "John Doe" was added</p>
                  <span className="ml-auto text-xs text-gray-500">Yesterday</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  <p className="text-sm">Subject "Data Structures" was assigned to "Jane Smith"</p>
                  <span className="ml-auto text-xs text-gray-500">3 days ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}