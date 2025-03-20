"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X, Loader2 } from "lucide-react"

interface SubjectTeacherSelectorProps {
  semester: number
  day: string
  timeSlot: string
  onCancel: () => void
  onComplete: () => void
}

interface Subject {
  id: number
  name: string
}

interface Teacher {
  id: number
  name: string
  subjects: number[]
}

export function SubjectTeacherSelector({ semester, day, timeSlot, onCancel, onComplete }: SubjectTeacherSelectorProps) {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null)
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([])

  useEffect(() => {
    const fetchSubjectsAndTeachers = async () => {
      try {
        const token = localStorage.getItem("access_token")
        const subjectsResponse = await fetch("http://localhost:8000/api/subjects/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const subjectsData = await subjectsResponse.json()
        setSubjects(subjectsData)

        const teachersResponse = await fetch("http://localhost:8000/api/teachers/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const teachersData = await teachersResponse.json()
        setTeachers(teachersData)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchSubjectsAndTeachers()
  }, [])

  useEffect(() => {
    if (selectedTeacher) {
      const teacher = teachers.find((t) => t.id === selectedTeacher)
      if (teacher) {
        const filtered = subjects.filter((subject) => teacher.subjects.includes(subject.id))
        setFilteredSubjects(filtered)
      }
    } else {
      setFilteredSubjects([])
    }
  }, [selectedTeacher, subjects, teachers])

  const handleAssign = async () => {
    if (!selectedSubject || !selectedTeacher) return

    setLoading(true)
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch("http://localhost:8000/api/add_teacher_and_subject/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          semester,
          day,
          time_slot: timeSlot,
          subject_id: selectedSubject,
          teacher_id: selectedTeacher,
        }),
      })

      if (response.ok) {
        onComplete()
      } else {
        console.error("Failed to assign teacher and subject")
      }
    } catch (error) {
      console.error("Error assigning teacher and subject:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Assign Subject & Teacher</CardTitle>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Slot</label>
              <div className="p-2 bg-gray-50 rounded text-sm">
                {day}, {timeSlot}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="teacher" className="text-sm font-medium">
                Teacher
              </label>
              <Select
                value={selectedTeacher?.toString() || ""}
                onValueChange={(value) => setSelectedTeacher(Number.parseInt(value))}
              >
                <SelectTrigger id="teacher">
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id.toString()}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <Select
                value={selectedSubject?.toString() || ""}
                onValueChange={(value) => setSelectedSubject(Number.parseInt(value))}
                disabled={!selectedTeacher}
              >
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={!selectedSubject || !selectedTeacher || loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Assigning...
                </>
              ) : (
                "Assign"
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  )
}