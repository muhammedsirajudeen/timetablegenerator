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
      
      
      setTimetableData(data.message ? [] : data)
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
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    
    let printContent = `
    <html>
      <head>
        <title>Timetable - Semester ${semesterNumber}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <script>
          tailwind.config = {
            theme: {
              extend: {
                fontFamily: {
                  sans: ['Plus Jakarta Sans', 'sans-serif'],
                },
                colors: {
                  primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                  },
                  slate: {
                    50: '#f8fafc',
                    100: '#f1f5f9', 
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                  },
                },
                backdropBlur: {
                  xs: '2px',
                }
              },
            },
          }
        </script>
        <style>
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
            @page {
              size: landscape;
              margin: 1cm;
            }
            .shadow-lg, .shadow-md, .shadow-sm, .shadow {
              box-shadow: none !important;
            }
            .bg-white\/60 {
              background-color: white !important;
            }
            .backdrop-blur-sm {
              backdrop-filter: none !important;
            }
          }
  
          /* Responsive styles */
          @media (max-width: 1024px) {
            .timetable-cell {
              padding: 0.5rem !important;
            }
            .timetable-cell-content {
              padding: 0.5rem !important;
            }
            .responsive-text {
              font-size: 0.75rem !important;
            }
            .responsive-icon {
              width: 0.75rem !important;
              height: 0.75rem !important;
            }
          }
          
          @media (max-width: 768px) {
            .timetable-wrapper {
              padding: 0.5rem !important;
            }
            .timetable-container {
              padding: 0.5rem !important;
            }
            .responsive-hidden {
              display: none !important;
            }
          }
          
          /* Make table horizontally scrollable */
          .table-responsive {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
        </style>
      </head>
      <body class="bg-gradient-to-br from-slate-50 to-slate-100 text-slate-700 p-2 sm:p-6 min-h-screen">
        <div class="max-w-full mx-auto bg-white/60 backdrop-blur-sm rounded-2xl p-3 sm:p-8 shadow-lg border border-white/80 timetable-wrapper">
          <div class="mb-4 sm:mb-8">
            <div class="flex items-center justify-center mb-1">
              <div class="h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 shadow-md flex items-center justify-center mr-2 sm:mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 class="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Timetable</h1>
            </div>
            <p class="text-slate-500 text-center text-sm sm:text-base">Semester ${semesterNumber}</p>
          </div>
          
          <div class="table-responsive overflow-hidden rounded-xl shadow-lg border border-slate-100">
            <table class="w-full border-collapse bg-white" style="min-width: 640px;">
              <tr>
                <th class="p-2 sm:p-4 text-center bg-slate-50/80 text-slate-700 font-semibold backdrop-blur-xs border-b border-slate-200 rounded-tl-xl timetable-cell">
                  <div class="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 sm:h-4 sm:w-4 text-slate-400 mr-1 sm:mr-2 responsive-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="responsive-text">Day / Time</span>
                  </div>
                </th>
    `;
    
    // Add time slot headers with modern gradient backgrounds
    timeSlots.forEach((timeSlot, index) => {
      // Determine time of day class with more modern gradients
      let timeClass = '';
      let timeIcon = '';
      
      if (index < timeSlots.length / 3) {
        // Morning - Sunrise gradient
        timeClass = 'from-sky-400 to-blue-500';
        timeIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 sm:h-4 sm:w-4 text-blue-100 mr-1 sm:mr-2 responsive-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>`;
      } else if (index < (timeSlots.length / 3) * 2) {
        // Afternoon - Blue to teal gradient
        timeClass = 'from-blue-500 to-teal-400';
        timeIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 sm:h-4 sm:w-4 text-blue-100 mr-1 sm:mr-2 responsive-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>`;
      } else {
        // Evening - Purple sunset gradient
        timeClass = 'from-indigo-500 to-purple-500';
        timeIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 sm:h-4 sm:w-4 text-blue-100 mr-1 sm:mr-2 responsive-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>`;
      }
      
      const isLast = index === timeSlots.length - 1;
      printContent += `
        <th class="p-2 sm:p-4 text-center text-white font-medium border-b border-slate-200 bg-gradient-to-r ${timeClass} ${isLast ? 'rounded-tr-xl' : ''} timetable-cell">
          <div class="flex items-center justify-center">
            <span class="responsive-hidden">${timeIcon}</span>
            <span class="responsive-text whitespace-nowrap">${timeSlot}</span>
          </div>
        </th>`;
    });
    
    printContent += `</tr>`;
    
    // Add day rows with modern cell designs
    days.forEach((day, dayIndex) => {
      const isLastDay = dayIndex === days.length - 1;
      
      // Day icons based on the day name
      let dayIcon = '';
      if (day.toLowerCase().includes('mon')) {
        dayIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 sm:h-4 sm:w-4 text-slate-400 mr-1 sm:mr-2 responsive-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>`;
      } else if (day.toLowerCase().includes('fri')) {
        dayIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 sm:h-4 sm:w-4 text-slate-400 mr-1 sm:mr-2 responsive-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>`;
      } else {
        dayIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 sm:h-4 sm:w-4 text-slate-400 mr-1 sm:mr-2 responsive-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>`;
      }
      
      printContent += `
        <tr>
          <td class="p-2 sm:p-4 border-b border-slate-200 bg-slate-50/50 ${isLastDay ? 'rounded-bl-xl' : ''} timetable-cell">
            <div class="flex items-center">
              <span class="responsive-hidden">${dayIcon}</span>
              <span class="font-semibold text-slate-800 responsive-text">${day}</span>
            </div>
          </td>`;
      
      timeSlots.forEach((timeSlot, timeIndex) => {
        const isLastTime = timeIndex === timeSlots.length - 1;
        const isLastCell = isLastDay && isLastTime;
        
        // Determine accent color class based on time of day
        let accentClass = '';
        let accentBgClass = '';
        if (timeIndex < timeSlots.length / 3) {
          accentClass = 'from-sky-500 to-blue-500'; // Morning
          accentBgClass = 'bg-blue-50';
        } else if (timeIndex < (timeSlots.length / 3) * 2) {
          accentClass = 'from-blue-500 to-teal-400'; // Afternoon
          accentBgClass = 'bg-teal-50';
        } else {
          accentClass = 'from-indigo-500 to-purple-500'; // Evening
          accentBgClass = 'bg-purple-50';
        }
        
        // Add zebra striping based on row
        const zebraClass = dayIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/30';
        
        const cell = getCellData(day, timeSlot);
        if (cell && cell.subject) {
          printContent += `
            <td class="p-2 sm:p-4 border-b border-slate-200 ${zebraClass} ${isLastCell ? 'rounded-br-xl' : ''} timetable-cell">
              <div class="bg-white rounded-xl p-2 sm:p-3 flex flex-col justify-center shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative overflow-hidden group timetable-cell-content">
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${accentClass}"></div>
                <div class="font-semibold text-slate-800 text-sm sm:text-base mb-0 sm:mb-1 responsive-text">${cell.subject}</div>
                <div class="text-xs sm:text-sm text-slate-500 flex items-center responsive-text">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-2 w-2 sm:h-3 sm:w-3 mr-1 text-slate-400 responsive-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  ${cell.teacher || "No Teacher"}
                </div>
              </div>
            </td>`;
        } else {
          printContent += `
            <td class="p-2 sm:p-4 border-b border-slate-200 ${zebraClass} ${isLastCell ? 'rounded-br-xl' : ''} timetable-cell">
              <div class="rounded-xl p-2 sm:p-3 text-center ${accentBgClass} bg-opacity-30 border border-slate-200 border-dashed timetable-cell-content">
                <span class="text-slate-400 text-xs sm:text-sm responsive-text">Available</span>
              </div>
            </td>`;
        }
      });
      
      printContent += `</tr>`;
    });
    
    printContent += `
            </table>
          </div>
          
          <div class="mt-2 sm:mt-4 text-right text-xs text-slate-400">
            <span>Last updated: ${new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </body>
    </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    printWindow.onload = () => {
      // Add a small delay before printing to ensure styles are applied
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  };

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

