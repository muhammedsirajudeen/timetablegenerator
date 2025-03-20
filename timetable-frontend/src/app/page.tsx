"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { motion } from "framer-motion"
import { ChevronRight, Clock, Calendar, LayoutGrid, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  const [userDetails, setUserDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const access = localStorage.getItem("access_token")

    if (!access) {
      setLoading(false)
      return
    }

    axios
      .get("http://localhost:8000/api/user/", {
        headers: { Authorization: `Bearer ${access}` },
      })
      .then((res) => {
        setUserDetails(res.data)
        setLoading(false)
      })
      .catch(() => {
        setUserDetails(null)
        setLoading(false)
      })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    setUserDetails(null)
    router.push("/user/auth/login")
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -top-[300px] -right-[300px] w-[600px] h-[600px] rounded-full bg-blue-100 opacity-30"
          animate={{
            x: [0, 10, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-[200px] -left-[200px] w-[400px] h-[400px] rounded-full bg-indigo-100 opacity-30"
          animate={{
            x: [0, -10, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Navigation Bar */}
      <motion.nav
        className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }}>
                <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                  Q
                </div>
                <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Quickshed
                </span>
              </motion.div>
            </div>
            <div className="flex items-center gap-2">
              {userDetails ? (
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button onClick={handleLogout} variant="ghost" className="font-medium">
                    Logout
                  </Button>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button
                    onClick={() => router.push("/user/auth/login")}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                  >
                    Login
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Schedule Smarter with{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Quickshed
                </span>
              </h1>

              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                Generate conflict-free timetables in seconds with our intelligent scheduling platform. Modern,
                intuitive, and designed for efficiency.
              </p>

              {userDetails ? (
                <motion.div
                  className="mb-8"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Card className="border-none shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                          {userDetails.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Welcome back, {userDetails.name}!</h3>
                          <p className="text-slate-600">Continue working on your schedule</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => router.push("/user/dashboard")}
                        className="mt-4 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                      >Go to Dashboard
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <Button
                    onClick={() => router.push("/user/auth/login")}
                    className="px-8 py-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg shadow-lg shadow-blue-200"
                  >
                    Get Started
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              )}
            </motion.div>

            {/* Right Column - Animated Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-square max-w-md mx-auto">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-3xl"
                  animate={{
                    scale: [1, 1.03, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-4 w-4/5 h-4/5">
                    {[...Array(9)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`rounded-xl shadow-md ${
                          [0, 2, 6, 8].includes(i)
                            ? "bg-white"
                            : i === 4
                              ? "bg-gradient-to-br from-blue-600 to-indigo-600"
                              : "bg-blue-50"
                        }`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.1 * i,
                        }}
                        whileHover={{ scale: 1.05, zIndex: 10 }}
                      />
                    ))}
                  </div>
                </div>

                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <Clock className="h-8 w-8 text-blue-600" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Quickshed
              </span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Our modern timetable generator combines simplicity with powerful features to make scheduling effortless
              and efficient.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                title: "Modern Design",
                description: "Clean interface for intuitive scheduling",
                icon: <LayoutGrid className="h-6 w-6 text-white" />,
                color: "from-blue-500 to-blue-600",
              },
              {
                title: "Time-Saving",
                description: "Create timetables in seconds, not hours",
                icon: <Clock className="h-6 w-6 text-white" />,
                color: "from-indigo-500 to-indigo-600",
              },
              {
                title: "Flexible",
                description: "Adaptable to your specific scheduling needs",
                icon: <Calendar className="h-6 w-6 text-white" />,
                color: "from-blue-500 to-blue-600",
              },
              {
                title: "Customizable",
                description: "Personalize every aspect of your schedule",
                icon: <Settings className="h-6 w-6 text-white" />,
                color: "from-indigo-500 to-indigo-600",
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={item} whileHover={{ y: -5 }} className="group">
                <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-slate-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Getting started with Quickshed is simple and straightforward
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                step: "01",
                title: "Create Account",
                description: "Sign up and set up your basic information",
              },
              {
                step: "02",
                title: "Add Schedule Items",
                description: "Input your classes, meetings, and activities",
              },
              {
                step: "03",
                title: "Generate & Share",
                description: "Create your timetable and share with others",
              },
            ].map((step, index) => (
              <motion.div key={index} variants={item} className="relative">
                <Card className="h-full border-none shadow-lg bg-white overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full opacity-70" />
                  <CardContent className="p-8 relative">
                    <span className="text-5xl font-bold text-slate-100">{step.step}</span>
                    <h3 className="font-semibold text-xl mb-3 mt-2">{step.title}</h3>
                    <p className="text-slate-600">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 bg-white"
      >
      </motion.section>
    </div>
  )
}

