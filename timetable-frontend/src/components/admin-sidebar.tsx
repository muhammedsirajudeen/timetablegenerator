"use client"

import { useRouter, usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { LogOut, Home, Users, BookOpen } from "lucide-react"

import { Button } from "@/components/ui/button"

interface AdminSidebarProps {
  onLogout: () => void
}

export function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }
  const isSemester = () => {
    const pathname = usePathname();
    return pathname.startsWith("/admin/semester/");
  };

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-64 bg-white shadow-lg p-6 fixed h-screen flex flex-col"
    >
      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Quickshed
      </h2>
      <nav className="mt-6 flex flex-col gap-2">
        <Button
          variant={isActive("/admin/home")|| isSemester() ? "secondary" : "ghost"}
          className="justify-start"
          onClick={() => router.push("/admin/home")}
        >
          <Home className="mr-2 h-4 w-4" /> Admin Dashboard
        </Button>
        <Button
          variant={isActive("/admin/teachers") ? "secondary" : "ghost"}
          className="justify-start"
          onClick={() => router.push("/admin/teachers")}
        >
          <Users className="mr-2 h-4 w-4" /> Manage Teachers
        </Button>
        <Button
          variant={isActive("/admin/subjects") ? "secondary" : "ghost"}
          className="justify-start"
          onClick={() => router.push("/admin/subjects")}
        >
          <BookOpen className="mr-2 h-4 w-4" /> Manage Subjects
        </Button>
      </nav>
      <Button variant="outline" className="mt-auto" onClick={onLogout}>
        <LogOut className="mr-2 h-4 w-4" /> Logout
      </Button>
    </motion.aside>
  )
}

