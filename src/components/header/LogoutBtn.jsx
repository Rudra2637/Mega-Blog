"use client"
import { useDispatch } from "react-redux"
import { logout } from "../../store/authSlice"
import authService from "../../appwrite/auth"

function LogoutBtn() {
  const dispatch = useDispatch()
  const handleLogout = () => {
    authService.logout().then(() => dispatch(logout()))
  }

  return (
    <button
      className="inline-block px-6 py-2 font-medium text-white bg-gradient-to-r from-rose-500 to-pink-600 rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] active:translate-y-[1px]"
      onClick={handleLogout}
    >
      Logout
    </button>
  )
}

export default LogoutBtn
