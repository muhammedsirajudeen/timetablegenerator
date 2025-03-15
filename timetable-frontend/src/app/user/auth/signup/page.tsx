"use client"

import { useRouter } from 'next/navigation'
import { useState,useEffect } from "react"
import axios from "axios"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { ToastContainer, toast } from 'react-toastify';
import { validatePassword, validateConfirmPassword, validateEmail } from "@/utils/validation"


export default function SignupPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>(""); // State for confirm password
  const router = useRouter();
  
  useEffect(()=>{
      const access = localStorage.getItem("access_token")
  
      if(access){
        router.push("/")
      }
    },[])

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
    } catch (error) {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <div className="w-full max-w-md space-y-8 bg-gray-900 p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Sign Up</h1>
          <p className="mt-2 text-sm text-gray-400">Create an account to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-2 border rounded-md bg-gray-800 text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium">Password</label>
            </div>
            <div className="mt-1 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="w-full px-4 py-2 border rounded-md bg-gray-800 text-white focus:ring-blue-500 focus:border-blue-500"
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
              <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirm Password</label>
            </div>
            <div className="mt-1 relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                className="w-full px-4 py-2 border rounded-md bg-gray-800 text-white focus:ring-blue-500 focus:border-blue-500"
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

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
