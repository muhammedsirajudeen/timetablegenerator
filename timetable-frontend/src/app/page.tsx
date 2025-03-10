"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const access = localStorage.getItem("access_token");

    if (!access) {
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:8000/api/user/", {
        headers: { Authorization: `Bearer ${access}` },
      })
      .then((res) => {
        setUserDetails(res.data);
        setLoading(false);
      })
      .catch(() => {
        setUserDetails(null);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setUserDetails(null);
    router.push("/user/auth/login"); // Redirect to login after logout
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-semibold text-blue-800">TimeTable Pro</span>
            </div>
            <div className="flex items-center">
              {userDetails ? (
                <button
                  onClick={handleLogout}
                  className="ml-4 px-4 py-2 text-sm font-medium text-white bg-blue-800 rounded hover:bg-blue-700 transition"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => router.push("/user/auth/login")}
                  className="ml-4 px-4 py-2 text-sm font-medium text-white bg-blue-800 rounded hover:bg-blue-700 transition"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:flex lg:items-center lg:justify-between">
          {/* Left Column - Text Content */}
          <div className="lg:w-1/2">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-blue-800">TimeTable Pro</span>
            </h1>
            
            {userDetails ? (
              <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border-l-4 border-blue-800">
                <p className="text-lg text-gray-700">
                  Welcome back, <span className="font-semibold">{userDetails.name}</span>!
                </p>
                <p className="mt-2 text-gray-600">
                  Your timetable planning session is ready to begin.
                </p>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="mt-4 px-6 py-2 bg-blue-800 text-white rounded hover:bg-blue-700 transition"
                >
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border-l-4 border-blue-800">
                <p className="text-lg text-gray-700">
                  Please log in to access your timetable tools.
                </p>
                <button
                  onClick={() => router.push("/user/auth/login")}
                  className="mt-4 px-6 py-2 bg-blue-800 text-white rounded hover:bg-blue-700 transition"
                >
                  Login to Continue
                </button>
              </div>
            )}
            
            <div className="prose prose-lg mt-6 text-gray-700">
              <p>
                TimeTable Pro is a comprehensive solution designed for educational institutions 
                and organizations that need efficient scheduling. Our platform allows you to 
                create conflict-free timetables with an intuitive interface and powerful algorithms.
              </p>
              <p className="mt-4">
                With TimeTable Pro, you can easily manage teacher assignments, classroom allocations, 
                and subject scheduling. Our system automatically detects conflicts and suggests 
                optimal arrangements based on your specific requirements and constraints.
              </p>
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-md border-t-4 border-blue-800">
                <h3 className="font-semibold text-lg text-gray-800">Easy to Use</h3>
                <p className="text-gray-600 mt-2">
                  Simple, intuitive interface designed for quick scheduling
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md border-t-4 border-blue-800">
                <h3 className="font-semibold text-lg text-gray-800">Conflict Detection</h3>
                <p className="text-gray-600 mt-2">
                  Automatically identifies and resolves scheduling conflicts
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md border-t-4 border-blue-800">
                <h3 className="font-semibold text-lg text-gray-800">Resource Management</h3>
                <p className="text-gray-600 mt-2">
                  Efficiently allocate classrooms, labs, and teaching staff
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md border-t-4 border-blue-800">
                <h3 className="font-semibold text-lg text-gray-800">Export Options</h3>
                <p className="text-gray-600 mt-2">
                  Download timetables in various formats (PDF, Excel, etc.)
                </p>
              </div>
            </div>
          </div>
          
          {/* Right Column - Image */}
          <div className="lg:w-1/2 mt-8 lg:mt-0 lg:pl-12">
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <div className="h-96 bg-blue-100 flex items-center justify-center">
                {/* Replace with your actual image */}
                <div className="text-center p-4">
                  <svg className="mx-auto h-24 w-24 text-blue-800" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                  </svg>
                  <p className="mt-4 text-blue-800 font-semibold">
                    Note: For the best experience, download and add a calendar illustration image here.
                  </p>
                  <p className="mt-2 text-sm text-blue-600">
                    Recommended: Use a clean, professional timetable/calendar illustration.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-gray-50 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Getting Started</h3>
              <ol className="list-decimal list-inside text-gray-700 space-y-2">
                <li>Create an account or log in to your existing account</li>
                <li>Set up your institution's basic information</li>
                <li>Add teachers, classrooms, and subjects</li>
                <li>Define time slots and scheduling constraints</li>
                <li>Generate your timetable automatically or create it manually</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-semibold">TimeTable Pro</h3>
              <p className="mt-2 text-gray-400">Simplifying scheduling for educational institutions</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white">
                  Help Center
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  Contact Us
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
            <div>
              <p className="text-gray-400">
                &copy; {new Date().getFullYear()} TimeTable Pro. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}