import React from 'react'
import { useDispatch } from 'react-redux'
import { logout } from '../../store/authSlice'
import authService from '../../appwrite/auth'


function LogoutBtn() {
    const dispatch = useDispatch()
    const handleLogout = () =>{
        authService.logout()     //these are promises and these need to be handled by then and catch
            .then(() => dispatch(logout()))
    }

  return (
    <button className = "inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full" onClick = {handleLogout}>LogOut</button>
  )
}

export default LogoutBtn