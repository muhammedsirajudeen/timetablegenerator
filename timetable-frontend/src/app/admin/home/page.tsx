"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { BookOpen, Users} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import toast, { Toaster } from "react-hot-toast"

export default function AdminDashboard() {
  const router = useRouter()
  const [teacherCount, setTeacherCount] = useState<number | null>(null)
  const [subjectCount, setSubjectCount] = useState<number | null>(null)
  const [structure, setStructure] = useState<Record<string, string[]> | null>(null)

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    router.push("/admin/auth/login")
  }
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

        // Fetch semester structure
        const structureRes = await fetch("http://localhost:8000/api/get_structure/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const structureData = await structureRes.json()
        setStructure(structureData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to fetch data")
      }
    }

    fetchCounts()
  }, [])

  const handleNavigate = (semester: string, grade: string) => {
    router.push(`/admin/semester/${semester}?grade=${grade}`)
  }
  const removeAllHandler=async ()=>{
    try {      
      const token=localStorage.getItem('access_token')
      await fetch("http://localhost:8000/api/remove_all_teacher_subject/", {
        method:'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Successfully removed',{style:{backgroundColor:"green",color:"white"}})
    } catch (error) {
      console.log(error)
      toast.error('Error removing',{style:{backgroundColor:"red",color:"white"}})
    }
  }
  const populateHandler=async ()=>{
    try {      
      const token=localStorage.getItem('access_token')
      await fetch("http://localhost:8000/api/populate-timetable/", {
        method:'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Successfully populated',{style:{backgroundColor:"green",color:"white"}})
    } catch (error) {
      console.log(error)
      toast.error('Error removing',{style:{backgroundColor:"red",color:"white"}})
    }
    
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
          <Button onClick={()=>populateHandler()} className="m-4" >Populate</Button>
          <Button onClick={()=>removeAllHandler()}  className="m-4" >Remove</Button>
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Semester Timetables</CardTitle>
                  <CardDescription>Select a semester to view or generate its timetable</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {structure &&
                  Object.entries(structure).map(([semester, grades]) => (
                    <motion.div key={semester} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Card className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold text-center mb-2">Semester {semester}</h3>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {grades.map((grade) => (
                              <Button
                                key={grade}
                                variant="outline"
                                className="px-4 py-2"
                                onClick={() => handleNavigate(semester, grade)}
                              >
                                Grade {grade}
                              </Button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <Toaster position="top-right" />
    </div>
  )
}
