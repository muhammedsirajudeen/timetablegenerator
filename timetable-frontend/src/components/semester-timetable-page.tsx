"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import toast, { Toaster } from "react-hot-toast"
import { Calendar, ArrowLeft, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminSidebar } from "./admin-sidebar"
import { TimetableGrid } from "./timetable-grid"

interface SemesterTimetablePageProps {
  semesterNumber: number
}

export function SemesterTimetablePage({ semesterNumber }: SemesterTimetablePageProps) {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    router.push("/admin/auth/login")
  }

  const handleGenerateTimetable = () => {
    setIsGenerating(true)
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false)
      toast.success("Timetable generated successfully!")
    }, 2000)
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
            <div className="flex items-center">
              <Button variant="ghost" size="sm" className="mr-4" onClick={() => router.push("/admin/home")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-3xl font-bold text-gray-800">Semester {semesterNumber} Timetable</h1>
            </div>
            <Button
              onClick={handleGenerateTimetable}
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" /> Generate Timetable
                </>
              )}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <TimetableGrid />
            </CardContent>
          </Card>
        </motion.div>
        <Toaster position="top-right" />
      </main>
    </div>
  )
}

