import { useState,useEffect } from 'react'
import { login,logout } from './store/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import authService from './appwrite/auth'


function App() {
  const [loading,setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getUser()
      .then((userData) => {
        if(userData) dispatch(login(userData))
        
        else dispatch(logout())
      })
      .finally(() => setLoading(false))
  },[])
  
  return !loading ? (
    <div className = "min-h-screen flex flex-wrap content-between bg-gray-400">
        <div className = "w-full block content-between">
          <Header />
          <main>
            {/* <Outlet /> */}
          </main>
          <Footer /> 
        </div>
    </div>
  ):
  (
    <>
      
    </>
  )
  




}

export default App
