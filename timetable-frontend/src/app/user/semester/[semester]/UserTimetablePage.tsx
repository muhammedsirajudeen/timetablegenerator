"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
  const searchParams=useSearchParams()
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
        const response = await fetch(`http://localhost:8000/api/get_timetable_by_semester/?semester=${semesterNumber}&grade=${searchParams.get('grade')}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await response.json()
        
        setTimetableData(data.message ? [] : data)
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
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    
    let printContent = `
    <html>
      <head>
        <title>Timetable - Semester ${semesterNumber} - Grade${searchParams.get('grade')}</title>
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
            <p class="text-slate-500 text-center text-sm sm:text-base">Semester ${semesterNumber} grade ${searchParams.get('grade')}</p>
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
  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
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
              <h1 className="text-3xl font-bold text-gray-800">Semester {semesterNumber} Grade {searchParams.get('grade')} Timetable</h1>
            </div>
            <Button 
                onClick={handlePrint} 
                className={`bg-gradient-to-r from-blue-600 to-indigo-600 text-white`}
                
                >
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