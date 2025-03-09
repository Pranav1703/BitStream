import { Box, HStack } from "@chakra-ui/react"
import MovieCard, { Movies } from "../components/MovieCard"
import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { AppContext } from "../App"

const MoviesPage = () => {

  const {recentMovies, setRecentMovies} = useContext(AppContext)
  
  const getRecentMovies = async()=>{
    const resp = await axios.get(`${import.meta.env.VITE_SERVER}/movies/recent`,{
      withCredentials: true
    })
    console.log(resp)
    const movies:Movies[] = resp.data
    setRecentMovies(movies)
  }

  useEffect(() => {
    
    if(recentMovies.length===0){
      getRecentMovies()
    }else{
      console.log("recent movies already retrieved: ",recentMovies)
    }

  }, [])
  

  return (
    <Box
    marginTop={"50px"}
    marginLeft={"100px"}
    marginRight={"100px"}
    h={"85vh"}
    >
      <HStack
      padding={"10px"}
      w={"100%"}
      wrap={"wrap"}
      overflow={"auto"}
      >
        {
          recentMovies.map((movie,i)=>(
            <MovieCard key={i}  Title={movie.Title} ImgUrl={movie.ImgUrl} Magnets={movie.Magnets}/>
          ))
        }
        
      </HStack>
      
    </Box>
  )
}

export default MoviesPage