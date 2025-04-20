"use client"

import { useState } from "react"
import authService from "../appwrite/auth"
import { Link, useNavigate } from "react-router-dom"
import { login } from "../store/authSlice"
import { Button, Input, Logo } from "./index.js"
import { useDispatch } from "react-redux"
import { useForm } from "react-hook-form"

function Signup() {
  const navigate = useNavigate()
  const [error, setError] = useState("")
  const dispatch = useDispatch()
  const { register, handleSubmit } = useForm()

  const create = async (data) => {
    setError("")
    try {
      const userData = await authService.createAccount(data)
      if (userData) {
        const userData = await authService.getCurrentUser()
        if (userData) dispatch(login(userData))
        navigate("/")
      }
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="flex items-center justify-center w-full min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8 space-y-8 border border-gray-100">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <span className="inline-block w-full max-w-[120px] transition-transform duration-300 hover:scale-110">
                <Logo width="100%" />
              </span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">Create your account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200"
              >
                Sign In
              </Link>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(create)} className="space-y-6">
            <div className="space-y-5">
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                {...register("name", {
                  required: true,
                })}
              />
              <Input
                label="Email"
                placeholder="Enter your email"
                type="email"
                {...register("email", {
                  required: true,
                  validate: {
                    matchPatern: (value) =>
                      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                      "Email address must be a valid address",
                  },
                })}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Create a password"
                {...register("password", {
                  required: true,
                })}
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-3 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]"
              >
                Create Account
              </Button>
            </div>
          </form>

          <div className="text-center text-xs text-gray-500 mt-8">
            By signing up, you agree to our{" "}
            <Link to="#" className="text-purple-600 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="#" className="text-purple-600 hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
