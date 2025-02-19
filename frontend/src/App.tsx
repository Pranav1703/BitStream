import { createContext, useEffect, useState } from 'react'
import './App.css'
import Player from './pages/player'
import {BrowserRouter as Router, Routes,Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import axios from 'axios'

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
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const resp = await axios.get(`${import.meta.env.VITE_SERVER}/auth`, {
          withCredentials: true
        });
        setUser(resp.data);
      } catch (error) {
        console.log("User not authenticated");
      }
    };
    checkAuth();
  }, []);

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
          <Route path='/player' element={<Player/>}/>
        </Routes>
        
      </Router>
    </UserContext.Provider>
    </>
  )
}

export default App
