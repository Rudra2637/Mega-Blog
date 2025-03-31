import { useState } from 'react'

import './App.css'

function App() {
  const [count, setCount] = useState(0)
  console.log(import.meta.env.VITE_APPWRITE_URL)
  return (
    <>
      <h1>A blog app by help of appwrite</h1>
    </>
  )
}

export default App
