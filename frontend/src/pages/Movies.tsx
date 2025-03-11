import { Box, HStack, Input, Kbd, Spinner } from "@chakra-ui/react"
import MovieCard from "../components/MovieCard"
import axios from "axios"
import { useContext, useEffect, useRef, useState, useMemo } from "react"
import { AppContext } from "../App"
import { Movies } from "../types"
import { LuSearch } from "react-icons/lu"
import { InputGroup } from "../components/ui/input-group"


type SearchResults = {
  Msg: string
  movies: Movies[]
}

const MoviesPage = () => {

  const {recentMovies, setRecentMovies} = useContext(AppContext)
  const [searchQuery,setSearchQuery] = useState<string>("")
  const [searchedMovies, setSearchedMovies] = useState<Movies[]>([])

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const getRecentMovies = async()=>{
    const resp = await axios.get(`${import.meta.env.VITE_SERVER}/movies/recent`,{
      withCredentials: true
    })
    
    const movies:Movies[] = resp.data
    setRecentMovies(movies)
  }
  let filteredMovies: Movies[] = [];
  // filteredMovies = useMemo(() => {
  //   return recentMovies.filter(movie =>
  //     movie.Title.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  // }, [searchQuery]);

  const searchShortcut = (event: KeyboardEvent) => {
    if (event.key === '/' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      searchInputRef.current?.focus();

    }
  };

  useEffect(() => {
    
    if(recentMovies.length===0){
      getRecentMovies()
    }else{
      console.log("recent movies already retrieved: ",recentMovies)
    }

    window.addEventListener('keydown', searchShortcut);

    return () => {
      window.removeEventListener('keydown', searchShortcut);
    }

  }, [])
  

  return (
    <Box
    marginTop={"15px"}
    marginLeft={"100px"}
    marginRight={"100px"}
    h={"85vh"}
    >
       <HStack width="full" justifyContent={"center"}>
        <InputGroup
          startElement={<LuSearch />}
          endElement={<Kbd>ctrl+/</Kbd>}
        >
          <Input placeholder="Search movies" 
                w={"550px"} 
                ref={searchInputRef} 
                onChange={(e)=>setSearchQuery(e.target.value)}
          />
        </InputGroup>
       </HStack>

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
          
          searchedMovies.length!==0?(
            <>
              {
                searchedMovies.map((movie,i)=>(
                  <MovieCard key={i}  Title={movie.Title} ImgUrl={movie.ImgUrl} Magnets={movie.Magnets}/>
                ))
              }
            </>
          ):recentMovies.length!==0 && searchQuery.length===0 ?(
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