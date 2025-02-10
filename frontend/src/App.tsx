import { createContext, useState } from 'react'
import './App.css'
import Player from './pages/player'
import {BrowserRouter as Router, Routes,Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'

type userContext = {
  user: string
  setUser: React.Dispatch<React.SetStateAction<string>>
}

export const UserContext = createContext<userContext>({
  user: "",
  setUser: ()=>{}
})


function App() {
  
  const [user,setUser] = useState<string>("")

  return (
    <>
    <UserContext.Provider value={{user,setUser}}>
      <Router>
        <Routes>
          {
            user?(
              <>
                <Route path='/' element={<Home/>} />
                <Route path='/player' element={<Player/>}/>
                <Route path="*" element={<Navigate to="/" />} />

              </>
            ):(
              <>
                <Route path='/login' element={<Login/>}/>
                <Route path='/signup' element={<Signup/>}/>
                <Route path="*" element={<Navigate to="/login"/>} />

              </>
            )
          }
          {/* <Route path='/player' element={<Player/>}/> */}
        </Routes>
        
      </Router>
    </UserContext.Provider>
    </>
  )
}

export default App
