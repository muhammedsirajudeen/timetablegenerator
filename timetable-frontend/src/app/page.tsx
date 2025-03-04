"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";



export default function Home() {
  const [userDetails, setUserDetails] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const access = localStorage.getItem("access_token");

    if (!access) return;

    axios
      .get("http://127.0.0.1:8000/api/user/", {
        headers: { Authorization: `Bearer ${access}` },
      })
      .then((res) => {
        setUserDetails(res.data);
      })
      .catch(() => {
        setUserDetails(null);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setUserDetails(null);
    router.push("/user/auth/login") // Redirect to login after logout
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800">Welcome</h1>

        {userDetails ? (
          <>
            <p className="text-lg text-gray-600 mt-4">
              Logged in as <span className="font-semibold">{userDetails.email
                
                } want to change this ui </span>
            </p>
            <button
              onClick={handleLogout}
              className="mt-6 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg w-full transition duration-300"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-500 mt-4">Please log in to access your details.


              
            </p>
            <button
              onClick={() => router.push("/user/auth/login")}
              className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg w-full transition duration-300"
            >
              Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
