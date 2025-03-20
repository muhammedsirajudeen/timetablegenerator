"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import toast, { Toaster } from "react-hot-toast"

interface SemesterTimetablePageProps {
  semesterNumber: number
}

export function UserTimetablePage({ semesterNumber }: SemesterTimetablePageProps) {
  const router = useRouter()
  const [timetableData, setTimetableData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [userDetails, setUserDetails] = useState(null)

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (token) {
      setUserDetails({ loggedIn: true })
    }
  }, [])

  // Fetch timetable data
  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setIsLoading(true)
        const token = localStorage.getItem("access_token")
        const response = await fetch(`http://localhost:8000/api/get_timetable_by_semester/?semester=${semesterNumber}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await response.json()
        setTimetableData(data)
      } catch (error) {
        console.error("Error fetching timetable:", error)
        toast.error("Failed to load timetable")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTimetable()
  }, [semesterNumber])

  // Days and time slots for the timetable
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  const timeSlots = ["09:00-09:50", "09:50-10:40", "10:50-11:40", "11:40-12:30", "01:15-02:05", "02:05-02:55", "03:05-04:00"]

  // Find class for a specific day and time slot
  const getCellData = (day, timeSlot) => {
    if (!timetableData) return null

    const classEntry = timetableData.find(
      (entry) => entry.day === day && entry.time_slot === timeSlot
    )

    return classEntry
      ? {
          subject: classEntry.subject || "No Subject",
          teacher: classEntry.teacher || "No Teacher",
        }
      : null
  }

  // Handle print functionality
  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    let printContent = `
    <html>
      <head>
        <title>Timetable - Semester ${semesterNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
          th { background-color: #f2f2f2; }
          .subject { font-size: 16px; font-weight: bold; }
          .teacher { font-size: 12px; color: #666; }
          h1 { text-align: center; }
          @media print {
            body { -webkit-print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <h1>Timetable - Semester ${semesterNumber}</h1>
        <table>
          <tr>
            <th>Day / Time</th>
            ${timeSlots.map((timeSlot) => `<th>${timeSlot}</th>`).join("")}
          </tr>
    `

    days.forEach((day) => {
      printContent += `<tr><td>${day}</td>`

      timeSlots.forEach((timeSlot) => {
        const cell = getCellData(day, timeSlot)
        if (cell && cell.subject) {
          printContent += `<td><div class="subject">${cell.subject}</div><div class="teacher">${cell.teacher || "No Teacher"}</div></td>`
        } else {
          printContent += `<td>-</td>`
        }
      })

      printContent += `</tr>`
    })

    printContent += `
        </table>
      </body>
    </html>
    `

    printWindow.document.open()
    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.onload = () => {
      printWindow.print()
    }
  }

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
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" className="mr-4" onClick={() => router.push("/user/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-3xl font-bold text-gray-800">Semester {semesterNumber} Timetable</h1>
            </div>
            <Button onClick={handlePrint} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <Printer className="h-4 w-4 mr-2" />
              Print Timetable
            </Button>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border border-gray-200 bg-gray-50 p-2 text-left">Time / Day</th>
                        {days.map((day) => (
                          <th key={day} className="border border-gray-200 bg-gray-50 p-2 text-center">
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {timeSlots.map((timeSlot) => (
                        <tr key={timeSlot}>
                          <td className="border border-gray-200 p-2 bg-gray-50 font-medium text-sm">
                            {timeSlot}
                          </td>
                          {days.map((day) => {
                            const classInfo = getCellData(day, timeSlot)
                            return (
                              <td key={`${day}-${timeSlot}`} className="border border-gray-200 p-2 h-24">
                                {classInfo ? (
                                  <div className="h-full flex flex-col p-1">
                                    <span className="font-semibold text-gray-600">{classInfo.subject}</span>
                                    <span className="text-sm text-gray-600">Teacher: {classInfo.teacher}</span>
                                  </div>
                                ) : (
                                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                                    No Class
                                  </div>
                                )}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        <Toaster position="top-right" />
      </main>
    </div>
  )
}