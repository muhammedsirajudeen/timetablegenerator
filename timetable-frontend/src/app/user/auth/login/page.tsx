"use client"

import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react"
import axios from "axios"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { ToastContainer, toast } from 'react-toastify';

export default function LoginPage() {

  

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Logging in with", { email, password })

    const userData = { email, password }
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/", userData)
      
      const { access, refresh } = response.data;
      
      
        
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
        
      
        router.push("/");
  
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <div className="w-full max-w-md space-y-8 bg-gray-900 p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="mt-2 text-sm text-gray-400">Please enter your credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Email Input */}
          <div className="space-y-4">
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
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Log In
            </button>
          </div>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Don&apos;t have an account? {" "}
            <Link href="/user/auth/signup" className="font-medium text-blue-400 hover:text-blue-300">
              Sign Up here
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}