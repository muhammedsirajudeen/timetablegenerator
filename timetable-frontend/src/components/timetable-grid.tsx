"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Printer, X, RefreshCw } from "lucide-react"
import { SubjectTeacherSelector } from "./subject-teacher-selector"
import toast from "react-hot-toast"

interface TimetableGridProps {
  semesterNumber?: number
}

export function TimetableGrid({ semesterNumber = 3 }: TimetableGridProps) {
  const [timetableData, setTimetableData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [selectedCell, setSelectedCell] = useState<{
    day: string
    timeSlot: string
  } | null>(null)

  // Extract unique time slots and sort them
  const timeSlots =["09:00-09:50", "09:50-10:40", "10:50-11:40", "11:40-12:30", "01:15-02:05", "02:05-02:55", "03:05-04:00"]

  // Define days of the week
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

  const fetchTimetable = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`http://localhost:8000/api/get_timetable_by_semester/?semester=${semesterNumber}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      const data = await response.json()
      setTimetableData(data)
    } catch (error) {
      console.error("Error fetching timetable:", error)
      toast.error("Failed to load timetable data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTimetable()
  }, [semesterNumber])

  const refreshTimetable = async () => {
    setRefreshing(true)
    await fetchTimetable()
    setRefreshing(false)
    toast.success("Timetable refreshed")
  }

  const getCellData = (day: string, timeSlot: string) => {
    return timetableData.find((item) => item.day === day && item.time_slot === timeSlot)
  }

  const handleRemove = async (day: string, timeSlot: string) => {
    try {
      const token = localStorage.getItem("access_token")
      const subjectResponse = await fetch("http://localhost:8000/api/remove_subject_from_timetable/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          semester: semesterNumber,
          day,
          time_slot: timeSlot,
        }),
      })

      // Remove teacher
      const teacherResponse = await fetch("http://localhost:8000/api/remove_teacher/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          semester: semesterNumber,
          day,
          time_slot: timeSlot,
        }),
      })

      if (subjectResponse.ok && teacherResponse.ok) {
        toast.success("Subject and teacher removed successfully")
        fetchTimetable()
      } else {
        toast.error("Failed to remove subject or teacher")
      }
    } catch (error) {
      console.error("Error removing data:", error)
      toast.error("An error occurred while removing data")
    }
  }

  const handleCellClick = (day: string, timeSlot: string) => {
    setSelectedCell({ day, timeSlot })
  }

  const handleAssignmentComplete = () => {
    setSelectedCell(null)
    fetchTimetable()
    toast.success("Subject and teacher assigned successfully")
  }

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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" size="sm" onClick={refreshTimetable} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print Timetable
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Day / Time</TableHead>
                {timeSlots.map((timeSlot) => (
                  <TableHead key={timeSlot} className="whitespace-nowrap">
                    {timeSlot}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {days.map((day) => (
                <TableRow key={day}>
                  <TableCell className="font-medium">{day}</TableCell>
                  {timeSlots.map((timeSlot) => {
                    const cellData = getCellData(day, timeSlot)
                    const hasData = cellData && (cellData.subject || cellData.teacher)

                    return (
                      <TableCell
                        key={`${day}-${timeSlot}`}
                        className={`min-w-[150px] ${!hasData ? "cursor-pointer hover:bg-gray-50" : ""}`}
                        onClick={() => !hasData && handleCellClick(day, timeSlot)}
                      >
                        {hasData ? (
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              {cellData.subject && <div className="font-medium text-gray-800">{cellData.subject}</div>}
                              {cellData.teacher && <div className="text-xs text-gray-500">{cellData.teacher}</div>}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-50 hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRemove(day, timeSlot)
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400 text-center py-2">Click to assign</div>
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {selectedCell && (
        <SubjectTeacherSelector
          semester={semesterNumber}
          day={selectedCell.day}
          timeSlot={selectedCell.timeSlot}
          onCancel={() => setSelectedCell(null)}
          onComplete={handleAssignmentComplete}
        />
      )}
    </div>
  )
}

