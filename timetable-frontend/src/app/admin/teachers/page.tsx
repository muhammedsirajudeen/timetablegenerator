"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ManageTeachers() {
  const router = useRouter();
  const [teachers, setTeachers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", subject: "Mathematics" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", subject: "Physics" },
    { id: 3, name: "Emma Johnson", email: "emma@example.com", subject: "Computer Science" },
    { id: 4, name: "Alice Brown", email: "alice@example.com", subject: "Biology" },
  ]);

  const [newTeacher, setNewTeacher] = useState({ name: "", email: "", subject: "" });

  const handleAddTeacher = () => {
    if (!newTeacher.name || !newTeacher.email || !newTeacher.subject) return;

    const updatedTeachers = [...teachers, { id: teachers.length + 1, ...newTeacher }];
    setTeachers(updatedTeachers);
    setNewTeacher({ name: "", email: "", subject: "" });
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/admin/auth/login");
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md p-6 fixed h-screen">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Panel</h2>
        <nav className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => router.push("/admin/home")}
            className="w-full text-left px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            Admin Dashboard
          </button>
          <button className="w-full text-left px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700">
            Manage Teachers
          </button>
          <button
            onClick={() => router.push("/admin/subjects")}
            className="w-full text-left px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            Manage Subjects
          </button>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </aside>

      {/* Main Content with Scrolling */}
      <main className="ml-64 flex-1 p-10 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">
            Manage Teachers
          </h1>

          {/* Add New Teacher Form */}
          <div className="bg-white dark:bg-gray-800 p-6 shadow-lg rounded-xl mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Add New Teacher</h2>
            <div className="grid grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Name"
                className="p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newTeacher.name}
                onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                className="p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newTeacher.email}
                onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
              />
              <input
                type="text"
                placeholder="Subject"
                className="p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newTeacher.subject}
                onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
              />
            </div>
            <button
              onClick={handleAddTeacher}
              className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Add Teacher
            </button>
          </div>

          {/* Teachers Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {teachers.map((teacher) => (
              <div key={teacher.id} className="bg-white dark:bg-gray-800 p-6 shadow-lg rounded-xl transition transform hover:scale-105">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{teacher.name}</h2>
                <p className="text-gray-600 dark:text-gray-300">{teacher.email}</p>
                <p className="text-blue-600 dark:text-blue-400 font-medium">{teacher.subject}</p>
                <div className="mt-4 flex gap-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    View
                  </button>
                  <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">
                    Edit
                  </button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
