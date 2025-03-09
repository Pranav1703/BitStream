import { createContext, useEffect, useState } from 'react'
import './App.css'
import Player from './pages/player'
import {BrowserRouter as Router, Routes,Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import axios from 'axios'
import MoviesPage from './pages/Movies'
import Anime from './pages/Anime'
import MyList from './pages/MyList'
import Header from './components/Header'
import { Movies } from './components/MovieCard'

type AppContext = {
  user: string
  setUser: React.Dispatch<React.SetStateAction<string>>
  recentMovies: Movies[]
  setRecentMovies: React.Dispatch<React.SetStateAction<Movies[]>>
}

export const AppContext = createContext<AppContext>({
  user: "",
  setUser: ()=>{},
  recentMovies: [],
  setRecentMovies: ()=>{}
})


function App() {
  
  const [user,setUser] = useState<string>("")
  const [recentMovies,setRecentMovies] = useState<Movies[]>([])


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
    <AppContext.Provider value={{user,setUser,recentMovies,setRecentMovies}}>
      <Router>
      {user? <Header/> : null}
        <Routes>
          {
            user?(
              <>
                  {/* <Route path='/' element={<Home/>} /> */}
                  <Route path='/player' element={<Player/>}/>
                  <Route path='/' element={<MoviesPage/>}/>
                  <Route path='/anime' element={<Anime/>} />
                  <Route path='/mylist' element={<MyList/>} />
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
    </AppContext.Provider>
    </>
  )
}

export default App
