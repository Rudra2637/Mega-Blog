"use client"

import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import "./App.css"
import authService from "./appwrite/auth"
import { login, logout } from "./store/authSlice"
import { Footer, Header } from "./components"
import { Outlet } from "react-router-dom"

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }))
        } else {
          dispatch(logout())
        }
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute top-0 w-full h-full rounded-full border-4 border-t-purple-600 border-r-transparent border-b-indigo-600 border-l-transparent animate-spin"></div>
            <div className="absolute top-2 left-2 w-20 h-20 rounded-full border-4 border-t-transparent border-r-purple-400 border-b-transparent border-l-indigo-400 animate-spin animation-delay-150"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-700">Loading your experience...</h2>
          <p className="text-gray-500 mt-2">Please wait while we prepare your blog</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col w-full bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <main className="flex-grow w-full pt-20 pb-0">
        <Outlet />
      </main>
      <Footer />

      {/* Add custom styles for animation delay */}
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .animation-delay-150 {
          animation-delay: 0.15s;
        }
      `}</style>
    </div>
  )
}

export default App
