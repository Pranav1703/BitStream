import { Box, HStack, Input, Kbd, Spinner, Text } from "@chakra-ui/react"
import MovieCard from "../components/MovieCard"
import axios from "axios"
import { useContext, useEffect, useRef, useState } from "react"
import { AppContext } from "../App"
import { Movies } from "../types"
import { LuSearch } from "react-icons/lu"
import { InputGroup } from "../components/ui/input-group"
import Mousetrap from 'mousetrap'
import MovieCard2 from "../components/MovieCard2"

type SearchResults = {
  msg: string
  movies: Movies[]
}

const darkCss = {
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
}

const lightCss = {
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#EEEEEE", // Dark track
    borderRadius: "10px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#76ABAE", // Thumb color
    borderRadius: "10px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#718096", // Hover effect
  },
}

const MoviesPage = () => {

  const {recentMovies, setRecentMovies} = useContext(AppContext)
  const [searchQuery,setSearchQuery] = useState<string>("")
  const [searchedMovies, setSearchedMovies] = useState<Movies[]>([])
  const [msg,setMsg] = useState<string>("")

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const getRecentMovies = async()=>{
    const resp = await axios.get(`${import.meta.env.VITE_SERVER}/movies/recent`,{
      withCredentials: true
    })
    
    const movies:Movies[] = resp.data
    setRecentMovies(movies)
  }
  
  // const filteredMovies = useMemo(() => {
  //   return recentMovies.filter(movie =>
  //     movie.Title.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  // }, [searchQuery]);


  const queryMovie = async() =>{
    try {
      const resp = await axios.get(`${import.meta.env.VITE_SERVER}/movies?s=${searchQuery}`,
        {
          withCredentials: true
        }
      )
      const results: SearchResults = resp.data 
      console.log("search results: ",results)
      
      
      if(results.msg.length!==0){
        setMsg(results.msg)
        return
      }else{
        setSearchedMovies(results.movies)
        return
      }

    } catch (error) {
      console.log(error)
    }
  }

  const search = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (searchQuery.length > 1) {
        await queryMovie();
      } else {
        alert("Search query length should be greater than 1.");
      }
    }
  };
  

  useEffect(() => {
    
    const searchInputFocus = ()=>{
      if (searchInputRef.current) {
        searchInputRef.current.focus()
      }
    }

    Mousetrap.bind(['command+/', 'ctrl+/'], (e) => {
      e.preventDefault() 
      searchInputFocus()
    })


    if(recentMovies.length===0){
      getRecentMovies()
    }else{
      console.log("recent movies already retrieved: ",recentMovies)
    }


    return () => {
      Mousetrap.unbind(['command+/', 'ctrl+/'])
    }

  }, [])
  

  return (
    <Box
    marginTop={"15px"}
    marginLeft={"100px"}
    marginRight={"100px"}
    h={"83vh"}
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
                borderWidth={"2px"}
                onKeyDown={search}
                name="search-movies"
          />
        </InputGroup>
       </HStack>
      
      <HStack
      padding={"10px"}
      w={"100%"}
      h={"100%"}
      wrap={"wrap"}
      overflow={"auto"}
      // css={{
      //   "&::-webkit-scrollbar": {
      //     width: "8px",
      //   },
      //   "&::-webkit-scrollbar-track": {
      //     background: "#2D3748", // Dark track
      //     borderRadius: "10px",
      //   },
      //   "&::-webkit-scrollbar-thumb": {
      //     background: "#4A6568", // Thumb color
      //     borderRadius: "10px",
      //   },
      //   "&::-webkit-scrollbar-thumb:hover": {
      //     background: "#718096", // Hover effect
      //   },
      // }}
      _dark={darkCss}
      _light={lightCss}
      >
        {
          
          searchedMovies.length!==0 && searchQuery.length!==0?(
            <>
              {
                searchedMovies.map((movie,i)=>(
                  <MovieCard key={i}  title={movie.title} imgUrl={movie.imgUrl} magnets={movie.magnets}/>
                ))
              }
            </>
          ):recentMovies.length!==0 && searchQuery.length===0 ?(
            <>
              {
                recentMovies.map((movie,i)=>(
                  <MovieCard key={i}  title={movie.title} imgUrl={movie.imgUrl} magnets={movie.magnets}/>
                ))
              }
              <MovieCard2 title={recentMovies[0].title} imgUrl={recentMovies[0].imgUrl} magnets={recentMovies[0].magnets}/>
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
                {
                  msg.length!==0?(
                    <Text textAlign={"center"}>{msg}</Text>
                  ):(
                    <Spinner size="xl" _dark={{color:"darkturquoise"}} _light={{color: "grey"}}/>
                  )
                }
              </Box>
              
            </>
          )

        }
        
      </HStack>
      
    </Box>
  )
}

export default MoviesPage