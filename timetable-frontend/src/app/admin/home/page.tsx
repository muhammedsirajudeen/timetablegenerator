"use client";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/admin/auth/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
        <nav className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => router.push("/admin/teachers")}
            className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-200 transition"
          >
            Manage Teachers
          </button>
          <button
            onClick={() => router.push("/admin/subjects")}
            className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-200 transition"
          >
            Manage Subjects
          </button>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-semibold text-gray-800">
            Welcome, Admin
          </h1>
          <p className="text-gray-600 mt-2">Manage your dashboard efficiently.</p>
        </div>
      </main>
    </div>
  );
}
