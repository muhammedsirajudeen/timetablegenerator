"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { BookOpen, Users, Clock, Calendar, Trash, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import toast, { Toaster } from "react-hot-toast"

export default function AdminDashboard() {
  const router = useRouter()
  const semesters = [3, 4, 5, 6,7,8]
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [confirmAction, setConfirmAction] = useState<(() => Promise<void>) | null>(null)
  const [teacherCount, setTeacherCount] = useState<number | null>(null)
  const [subjectCount, setSubjectCount] = useState<number | null>(null)

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const token = localStorage.getItem("access_token")

        // Fetch teachers
        const teacherRes = await fetch("http://localhost:8000/api/teachers/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const teachers = await teacherRes.json()
        setTeacherCount(teachers.length)

        // Fetch subjects
        const subjectRes = await fetch("http://localhost:8000/api/subjects/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const subjects = await subjectRes.json()
        setSubjectCount(subjects.length)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to fetch data")
      }
    }

    fetchCounts()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    router.push("/admin/auth/login")
  }

  const handleGenerateTimetable = () => {
    setConfirmAction(() => async () => {
      setIsGenerating(true)
      setConfirmAction(null)
      try {
        const token = localStorage.getItem("access_token")
        await fetch("http://localhost:8000/api/populate-timetable/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
        })
        toast.success("Timetable generated successfully!")
      } catch (error) {
        console.error("Error generating timetable:", error)
        toast.error("Error generating timetable")
      }
      setIsGenerating(false)
    })
  }

  const handleRemoveAll = () => {
    setConfirmAction(() => async () => {
      setIsRemoving(true)
      setConfirmAction(null)
      try {
        const token = localStorage.getItem("access_token")
        await fetch("http://localhost:8000/api/remove_all_teacher_subject/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
        })
        toast.success("All teacher and subjects removed successfully!")
      } catch (error) {
        console.error("Error removing all teacher subjects:", error)
        toast.error("Error removing all teacher and subjects")
      }
      setIsRemoving(false)
    })
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      <AdminSidebar onLogout={handleLogout} />

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Teachers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-500 mr-3" />
                  <span className="text-3xl font-bold">
                    {teacherCount !== null ? teacherCount : "Loading..."}
                  </span>
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
                  <span className="text-3xl font-bold">
                    {subjectCount !== null ? subjectCount : "Loading..."}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Semester Timetables</CardTitle>
                  <CardDescription>Select a semester to view or generate its timetable</CardDescription>
                </div>
                <div className="flex gap-4">
                  <Button onClick={handleGenerateTimetable} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    {isGenerating ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Calendar className="mr-2 h-4 w-4" />} {isGenerating ? "Generating..." : "Generate Timetable"}
                  </Button>
                  <Button onClick={handleRemoveAll} className="bg-red-600 text-white">
                    {isRemoving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Trash className="mr-2 h-4 w-4" />} {isRemoving ? "Removing..." : "Remove All"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {semesters.map((semester) => (
                  <motion.div key={semester} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push(`/admin/semester/${semester}`)}>
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
        </motion.div>
      </main>

      {confirmAction && (
        <Dialog open={true} onOpenChange={() => setConfirmAction(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>This action cannot be undone.</DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConfirmAction(null)}>Cancel</Button>
              <Button className="bg-red-600 text-white" onClick={confirmAction}>Confirm</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <Toaster position="top-right" />
    </div>
  )
}
