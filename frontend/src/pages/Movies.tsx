import { Box, HStack, Spinner } from "@chakra-ui/react"
import MovieCard, { Movies } from "../components/MovieCard"
import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { AppContext } from "../App"

type SearchResults = {
  Msg: string
  movies: Movies[]
}

const MoviesPage = () => {

  const {recentMovies, setRecentMovies} = useContext(AppContext)
  const {} = useState<Movies[]>([])

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
      h={"100%"}
      wrap={"wrap"}
      overflow={"auto"}
      css={{
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#2D3748", // Dark track
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#4A6568", // Thumb color
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "#718096", // Hover effect
        },
      }}
      >
        {
          recentMovies.length!==0?(
            <>
              {
                recentMovies.map((movie,i)=>(
                  <MovieCard key={i}  Title={movie.Title} ImgUrl={movie.ImgUrl} Magnets={movie.Magnets}/>
                ))
              }
            </>
          ):(
            <>
              <Box
              w={"100%"}
              h={"100%"}
              maxH={"100%"}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              paddingBottom={"50px"}
              >
                <Spinner size="xl" _dark={{color:"darkturquoise"}} _light={{color: "grey"}}/>
              </Box>
              
            </>
          )

        }
        
      </HStack>
      
    </Box>
  )
}

export default MoviesPage