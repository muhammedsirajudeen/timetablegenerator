"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"
import { Eye, EyeOff, User, Shield } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginType, setLoginType] = useState("admin") // Default to admin login
  const router = useRouter()

  useEffect(() => {
    const access = localStorage.getItem("access_token")

    if (access) {
      router.push("/admin/home")
    }
  }, [])

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Logging in with", { email, password })

    const userData = { email, password }
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/admin/login/", userData)

      const { access, refresh } = response.data

      localStorage.setItem("access_token", access)
      localStorage.setItem("refresh_token", refresh)

      router.push("/admin/home")
    } catch (error) {
      toast.error("Login failed. Please check your credentials.")
    }
  }

  const handleLoginTypeChange = (type: string) => {
    setLoginType(type)
    if (type === "user") {
      router.push("/user/auth/login")
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/564ce10c-0b42-4589-9f58-63cb5e701709.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      <div className="w-full max-w-md space-y-8 bg-gray-900 p-8 rounded-lg shadow-lg backdrop-blur-sm bg-opacity-80 z-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">QuickShed</h1>
          <p className="mt-2 text-sm text-gray-300">Login to access your dashboard</p>
        </div>

        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={() => handleLoginTypeChange("admin")}
            className={`flex flex-col items-center px-6 py-3 rounded-lg transition-all ${
              loginType === "admin" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <Shield className="h-8 w-8 mb-2" />
            <span className="text-sm font-medium">Admin</span>
          </button>

          <button
            onClick={() => handleLoginTypeChange("user")}
            className={`flex flex-col items-center px-6 py-3 rounded-lg transition-all ${
              loginType === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <User className="h-8 w-8 mb-2" />
            <span className="text-sm font-medium">User</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Email Input */}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-2 border rounded-md bg-gray-800 text-white border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-white">
                  Password
                </label>
              </div>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-2 border rounded-md bg-gray-800 text-white border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-gray-400 hover:text-gray-300 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Log In as Admin
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">Need help? Contact support</p>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

