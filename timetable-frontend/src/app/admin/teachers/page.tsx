"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ManageTeachers() {
  const router = useRouter();
  interface Teacher {
    id: number;
    name: string;
    phone_number: string;
    department: string;
    subjects: string[];
  }
  
  const [teachers, setTeachers] = useState<Teacher[]>([]);  
  const [newTeacher, setNewTeacher] = useState({ name: "", phone_number: ""});
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Fetch teachers from the backend API
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://localhost:8000/api/teachers/", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch teachers");
        const data = await response.json();
        setTeachers(data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };
    fetchTeachers();
  }, []);
  
  const handleAddTeacher = async () => {
    const token = localStorage.getItem("access_token");
    if (!newTeacher.name || !/^[0-9]{10}$/.test(newTeacher.phone_number)) {
      alert("Please enter a valid name and a 10-digit phone number.");
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/api/teachers/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-type": "application/json"
        },
        body: JSON.stringify(newTeacher),
      });

      if (!response.ok) throw new Error("Failed to add teacher");

      const newTeacherData = await response.json();
      setTeachers((prev) => [...prev, newTeacherData]);
      setNewTeacher({ name: "", phone_number: ""});
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding teacher:", error);
    }
  };

  const handleEditTeacher = async () => {
    if (!selectedTeacher) return;
    
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`http://localhost:8000/api/teachers/${selectedTeacher.id}/`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-type": "application/json"
        },
        body: JSON.stringify(selectedTeacher),
      });

      if (!response.ok) throw new Error("Failed to update teacher");

      const updatedTeacher = await response.json();
      setTeachers(teachers.map(t => t.id === updatedTeacher.id ? updatedTeacher : t));
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating teacher:", error);
    }
  };

  const handleViewTeacher = async (id: number) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`http://localhost:8000/api/teachers/${id}/`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });
      if (!response.ok) throw new Error("Failed to fetch teacher details");
      const data = await response.json();
      setSelectedTeacher(data);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error("Error fetching teacher details:", error);
    }
  };

  const openEditModal = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsEditModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/admin/auth/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 fixed h-screen flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
        <nav className="mt-6 flex flex-col gap-2">
          <button
            onClick={() => router.push("/admin/home")}
            className="w-full text-left px-4 py-2 rounded text-gray-700 hover:bg-gray-100 transition"
          >
            Admin Dashboard
          </button>
          <button className="w-full text-left px-4 py-2 rounded text-gray-700 bg-gray-100">
            Manage Teachers
          </button>
          <button
            onClick={() => router.push("/admin/subjects")}
            className="w-full text-left px-4 py-2 rounded text-gray-700 hover:bg-gray-100 transition"
          >
            Manage Subjects
          </button>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Manage Teachers</h1>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Add New Teacher
            </button>
          </div>

          {/* Teachers Table */}
          <div className="bg-white shadow-md rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{teacher.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{teacher.phone_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{teacher.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewTeacher(teacher.id)} 
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => openEditModal(teacher)} 
                          className="text-yellow-600 hover:text-yellow-800"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {teachers.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                No teachers found. Add a new teacher to get started.
              </div>
            )}
          </div>
        </div>

        {/* View Teacher Modal */}
        {isViewModalOpen && selectedTeacher && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Teacher Details</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {selectedTeacher.name}</p>
                <p><span className="font-medium">Phone:</span> {selectedTeacher.phone_number}</p>
                <p><span className="font-medium">Department:</span> {selectedTeacher.department || "Not assigned"}</p>
                <p><span className="font-medium">Subjects:</span> {selectedTeacher.subjects?.length ? selectedTeacher.subjects.join(", ") : "None assigned"}</p>
              </div>
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={() => setIsViewModalOpen(false)} 
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Teacher Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Add New Teacher</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={newTeacher.name}
                    onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={newTeacher.phone_number}
                    onChange={(e) => setNewTeacher({ ...newTeacher, phone_number: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddTeacher}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Add Teacher
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Teacher Modal */}
        {isEditModalOpen && selectedTeacher && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Edit Teacher</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={selectedTeacher.name}
                    onChange={(e) => setSelectedTeacher({ ...selectedTeacher, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={selectedTeacher.phone_number}
                    onChange={(e) => setSelectedTeacher({ ...selectedTeacher, phone_number: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleEditTeacher}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}