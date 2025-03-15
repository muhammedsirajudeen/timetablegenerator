"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import toast,{ Toaster } from "react-hot-toast"
import { validateMobileNumber } from "@/utils/validation"
import { Plus, Eye, Edit, LogOut, BookOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { AdminSidebar } from "@/components/admin-sidebar"

interface Teacher {
  id: number
  name: string
  phone_number: string
  department: string
  subjects: number[]
}

interface Subject {
  id: number
  semester: number
  name: string
  subject_code: string
}

export default function ManageTeachers() {
  const router = useRouter()
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [newTeacher, setNewTeacher] = useState({ name: "", phone_number: "" })
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)

  useEffect(() => {
    fetchTeachers()
    fetchSubjects()
  }, [])

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch("http://localhost:8000/api/teachers/", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch teachers")
      }
      const data = await response.json()
      setTeachers(data)
    } catch (error) {
      toast.error("Error fetching teachers")
      console.error("Error fetching teachers:", error)
    }
  }

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch("http://localhost:8000/api/subjects/", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch subjects")
      }
      const data = await response.json()
      setSubjects(data)
    } catch (error) {
      toast.error("Error fetching subjects")
      console.error("Error fetching subjects:", error)
    }
  }

  const handleAddTeacher = async () => {
    if (!newTeacher.name || !validateMobileNumber(newTeacher.phone_number)) {
      toast.error("Please enter a valid name and a 10-digit phone number")
      return
    }
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch("http://localhost:8000/api/teachers/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify(newTeacher),
      })

      if (!response.ok) {
        throw new Error("Failed to add teacher")
      }
      const newTeacherData = await response.json()
      setTeachers((prev) => [...prev, newTeacherData])
      setNewTeacher({ name: "", phone_number: "" })
      setIsAddModalOpen(false)
      toast.success("Successfully added teacher")
    } catch (error) {
      toast.error("Error adding teacher")
      console.error("Error adding teacher:", error)
    }
  }

  const handleEditTeacher = async () => {
    if (!selectedTeacher || !validateMobileNumber(selectedTeacher.phone_number) || !selectedTeacher.name) {
      toast.error("Please enter a valid name and a 10-digit phone number")
      return
    }

    try {
      const token = localStorage.getItem("access_token")
      const payload = {
        name: selectedTeacher.name,
        phone_number: selectedTeacher.phone_number,
      }
      const response = await fetch(`http://localhost:8000/api/teachers/${selectedTeacher.id}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Failed to update teacher")
      }
      const updatedTeacher = await response.json()
      setTeachers(teachers.map((t) => (t.id === updatedTeacher.id ? updatedTeacher : t)))
      setIsEditModalOpen(false)
      toast.success("Successfully updated teacher")
    } catch (error) {
      toast.error("Error updating teacher")
      console.error("Error updating teacher:", error)
    }
  }

  const handleViewTeacher = async (id: number) => {
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`http://localhost:8000/api/teachers/${id}/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) throw new Error("Failed to fetch teacher details")
      const data = await response.json()
      setSelectedTeacher(data)
      setIsViewModalOpen(true)
    } catch (error) {
      toast.error("Error fetching teacher details")
      console.error("Error fetching teacher details:", error)
    }
  }

  const handleAssignSubject = async (subjectId: number) => {
    if (!selectedTeacher) return
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch("http://localhost:8000/api/teachers/assign/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({ teacher: selectedTeacher.id, subject: subjectId }),
      })

      if (!response.ok) {
        throw new Error("Failed to assign subject")
      }
      setSelectedTeacher((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          subjects: [...prev.subjects, subjectId],
        };
      });
      toast.success("Subject assigned successfully")
      fetchTeachers() // Refresh teacher data
    } catch (error) {
      toast.error("Error assigning subject")
      console.error("Error assigning subject:", error)
    }
  }

  const handleUnassignSubject = async (subjectId: number) => {
    if (!selectedTeacher) return
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch("http://localhost:8000/api/teachers/assign/", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({ teacher: selectedTeacher.id, subject: subjectId }),
      })

      if (!response.ok) {
        throw new Error("Failed to unassign subject")
      }
      setSelectedTeacher((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          subjects: prev.subjects.filter((id) => id !== subjectId),
        };
      });
      toast.success("Subject unassigned successfully")
      fetchTeachers() // Refresh teacher data
    } catch (error) {
      toast.error("Error unassigning subject")
      console.error("Error unassigning subject:", error)
    }
  }

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
            <h1 className="text-3xl font-bold text-gray-800">Manage Teachers</h1>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add New Teacher
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Teachers</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell>{teacher.name}</TableCell>
                      <TableCell>{teacher.phone_number}</TableCell>
                      <TableCell>{teacher.department}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewTeacher(teacher.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTeacher(teacher)
                              setIsEditModalOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTeacher(teacher)
                              setIsAssignModalOpen(true)
                            }}
                          >
                            <BookOpen className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {teachers.length === 0 && (
                <div className="py-8 text-center text-gray-500">
                  No teachers found. Add a new teacher to get started.
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* View Teacher Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Teacher Details</DialogTitle>
            </DialogHeader>
            {selectedTeacher && (
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Name:</span> {selectedTeacher.name}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {selectedTeacher.phone_number}
                </p>
                <p>
                  <span className="font-medium">Department:</span> {selectedTeacher.department || "Not assigned"}
                </p>
                <p>
                  <span className="font-medium">Subjects:</span>{" "}
                  {selectedTeacher.subjects?.length ? selectedTeacher.subjects.join(", ") : "None assigned"}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Teacher Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Teacher</DialogTitle>
              <DialogDescription>Enter the details of the new teacher here.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={newTeacher.phone_number}
                  onChange={(e) => setNewTeacher({ ...newTeacher, phone_number: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTeacher}>Add Teacher</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Teacher Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Teacher</DialogTitle>
              <DialogDescription>Update the teacher's information here.</DialogDescription>
            </DialogHeader>
            {selectedTeacher && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={selectedTeacher.name}
                    onChange={(e) => setSelectedTeacher({ ...selectedTeacher, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Phone Number</Label>
                  <Input
                    id="edit-phone"
                    value={selectedTeacher.phone_number}
                    onChange={(e) => setSelectedTeacher({ ...selectedTeacher, phone_number: e.target.value })}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditTeacher}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Assign/Unassign Subject Modal */}
        <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Subjects for {selectedTeacher?.name}</DialogTitle>
              <DialogDescription>Assign or unassign subjects to this teacher.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Semester</TableHead>
                    <TableHead>Subject Name</TableHead>
                    <TableHead>Subject Code</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjects.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell>{subject.semester}</TableCell>
                      <TableCell>{subject.name}</TableCell>
                      <TableCell>{subject.subject_code}</TableCell>
                      <TableCell>
                        {selectedTeacher?.subjects?.includes(subject.id) ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleUnassignSubject(subject.id)}
                          >
                            Unassign
                          </Button>
                        ) : (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleAssignSubject(subject.id)}
                          >
                            Assign
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAssignModalOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Toaster
          position="top-right"
          reverseOrder={false}
        />
      </main>
    </div>
  )
}