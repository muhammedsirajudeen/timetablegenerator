"use client"

import { useRouter } from 'next/navigation'
import { useState, useEffect } from "react"
import axios from "axios"
import { Eye, EyeOff, User, Shield } from "lucide-react"
import Link from "next/link"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { validatePassword, validateConfirmPassword, validateEmail } from "@/utils/validation"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loginType, setLoginType] = useState("user"); // Default to user signup
  const router = useRouter();
  
  useEffect(() => {
    const access = localStorage.getItem("access_token")
  
    if(access) {
      router.push("/")
    }
  }, [])

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)
    const confirmPasswordError = validateConfirmPassword(password, confirmPassword)

    if (emailError) {
      toast.error(emailError)
      return
    }
    if (passwordError) {
      toast.error(passwordError)
      return
    }
    if (confirmPasswordError) {
      toast.error(confirmPasswordError)
      return
    }
   
    const userData = { email, password } 
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register/", userData)
      if (response.status == 201) {
        console.log("Successfully signed up");
        router.push("/user/auth/login")
      }
    } catch (error:any) {
      if (error.response) {
        // Backend responded with an error (validation, conflict, etc.)
        const errorMessage = error.response.data.detail || "Registration failed. Please try again.";
        toast.error(errorMessage);
      } else if (error.request) {
        // No response from the server
        toast.error("Server not responding. Please check your internet connection.");
      } else {
        // Other unexpected errors
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  }

  const handleLoginTypeChange = (type: string) => {
    setLoginType(type)
    if (type === "admin") {
      router.push("/admin/auth/login")
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
          <p className="mt-2 text-sm text-gray-300">Create an account to get started</p>
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
              <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
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
                <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
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

            {/* Confirm Password Input */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">Confirm Password</label>
              </div>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-2 border rounded-md bg-gray-800 text-white border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="text-gray-400 hover:text-gray-300 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
              Sign Up
            </button>
          </div>
        </form>

        {/* Login Link */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Already have an account? {" "}
            <Link href="/user/auth/login" className="font-medium text-blue-400 hover:text-blue-300">
              Log in here
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}