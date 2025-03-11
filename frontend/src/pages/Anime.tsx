import { Box, HStack, Input, Kbd, Spinner } from "@chakra-ui/react"
import axios from "axios"
import { useContext, useState, useRef, useEffect } from "react"
import { LuSearch } from "react-icons/lu"
import { AppContext } from "../App"
import { InputGroup } from "../components/ui/input-group"
import { Anime } from "../types"

const AnimePage = () => {
  const {anime, setAnime} = useContext(AppContext)
  const [searchQuery,setSearchQuery] = useState<string>("")
  // const [searchedAnime, setSearchedAnime] = useState<Movies[]>([])

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const getRecentMovies = async()=>{
    const resp = await axios.get(`${import.meta.env.VITE_SERVER}/anime?s=${searchQuery}`,{
      withCredentials: true
    })
    
    const data:Anime[] = resp.data
    setAnime(data)
  }


  useEffect(() => {
      const searchShortcut = (event: KeyboardEvent) => {

    if (event.key === '/' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      searchInputRef.current?.focus();

    }

  };

    if(anime.length===0){
      getRecentMovies()
    }else{
      console.log("recent movies already retrieved: ",anime)
    }

    window.addEventListener('keydown', searchShortcut);

    return () => window.removeEventListener('keydown', searchShortcut);

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
          anime.length!==0?(
            <>
              {
                anime.map((movie,i)=>(
                  <>
                  
                  </>
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

export default AnimePage