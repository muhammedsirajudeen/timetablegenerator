"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { toast } from "react-hot-toast"
import { Plus, Eye, Edit, LogOut } from "lucide-react"

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

interface Subject {
  id: number
  semester: number
  name: string
  subject_code: string
}

export default function ManageSubjects() {
  const router = useRouter()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [newSubject, setNewSubject] = useState({ semester: 0, name: "", subject_code: "" })
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    fetchSubjects()
  }, [])

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

  const handleAddSubject = async () => {
    if (!newSubject.name || !newSubject.subject_code || newSubject.semester <= 0) {
      toast.error("Please fill all fields correctly")
      return
    }
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch("http://localhost:8000/api/subjects/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify(newSubject),
      })

      if (!response.ok) {
        throw new Error("Failed to add subject")
      }
      const newSubjectData = await response.json()
      setSubjects((prev) => [...prev, newSubjectData])
      setNewSubject({ semester: 0, name: "", subject_code: "" })
      setIsAddModalOpen(false)
      toast.success("Successfully added subject")
    } catch (error) {
      toast.error("Error adding subject")
      console.error("Error adding subject:", error)
    }
  }

  const handleEditSubject = async () => {
    if (!selectedSubject || !selectedSubject.name || !selectedSubject.subject_code || selectedSubject.semester <= 0) {
      toast.error("Please fill all fields correctly")
      return
    }

    try {
      const token = localStorage.getItem("access_token")
      const payload = {
        semester: selectedSubject.semester,
        name: selectedSubject.name,
        subject_code: selectedSubject.subject_code,
      }
      const response = await fetch(`http://localhost:8000/api/subjects/${selectedSubject.id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Failed to update subject")
      }
      const updatedSubject = await response.json()
      setSubjects(subjects.map((s) => (s.id === updatedSubject.id ? updatedSubject : s)))
      setIsEditModalOpen(false)
      toast.success("Successfully updated subject")
    } catch (error) {
      toast.error("Error updating subject")
      console.error("Error updating subject:", error)
    }
  }

  const handleViewSubject = async (id: number) => {
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`http://localhost:8000/api/subjects/${id}/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) throw new Error("Failed to fetch subject details")
      const data = await response.json()
      setSelectedSubject(data)
      setIsViewModalOpen(true)
    } catch (error) {
      toast.error("Error fetching subject details")
      console.error("Error fetching subject details:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    router.push("/admin/auth/login")
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-64 bg-white shadow-lg p-6 fixed h-screen flex flex-col"
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Admin Panel
        </h2>
        <nav className="mt-6 flex flex-col gap-2">
          <Button variant="ghost" className="justify-start" onClick={() => router.push("/admin/home")}>
            Admin Dashboard
          </Button>
          <Button variant="ghost" className="justify-start" onClick={() => router.push("/admin/teachers")}>
            Manage Teachers
          </Button>
          <Button variant="secondary" className="justify-start">
            Manage Subjects
          </Button>
        </nav>
        <Button variant="outline" className="mt-auto" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </motion.aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-6 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Manage Subjects</h1>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add New Subject
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Semester</TableHead>
                    <TableHead>Name</TableHead>
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
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewSubject(subject.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedSubject(subject)
                              setIsEditModalOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {subjects.length === 0 && (
                <div className="py-8 text-center text-gray-500">
                  No subjects found. Add a new subject to get started.
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* View Subject Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Subject Details</DialogTitle>
            </DialogHeader>
            {selectedSubject && (
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Semester:</span> {selectedSubject.semester}
                </p>
                <p>
                  <span className="font-medium">Name:</span> {selectedSubject.name}
                </p>
                <p>
                  <span className="font-medium">Subject Code:</span> {selectedSubject.subject_code}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Subject Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
              <DialogDescription>Enter the details of the new subject here.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="semester">Semester</Label>
                <Input
                  id="semester"
                  type="number"
                  value={newSubject.semester}
                  onChange={(e) => setNewSubject({ ...newSubject, semester: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="subject_code">Subject Code</Label>
                <Input
                  id="subject_code"
                  value={newSubject.subject_code}
                  onChange={(e) => setNewSubject({ ...newSubject, subject_code: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSubject}>Add Subject</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Subject Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Subject</DialogTitle>
              <DialogDescription>Update the subject's information here.</DialogDescription>
            </DialogHeader>
            {selectedSubject && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-semester">Semester</Label>
                  <Input
                    id="edit-semester"
                    type="number"
                    value={selectedSubject.semester}
                    onChange={(e) => setSelectedSubject({ ...selectedSubject, semester: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={selectedSubject.name}
                    onChange={(e) => setSelectedSubject({ ...selectedSubject, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-subject_code">Subject Code</Label>
                  <Input
                    id="edit-subject_code"
                    value={selectedSubject.subject_code}
                    onChange={(e) => setSelectedSubject({ ...selectedSubject, subject_code: e.target.value })}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditSubject}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}