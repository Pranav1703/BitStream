import { Box, HStack, Input, Kbd, Spinner, Table, Button, Text, InputAddon, Group } from "@chakra-ui/react"
import axios from "axios"
import { useContext, useState, useRef, useEffect } from "react"
import { LuSearch } from "react-icons/lu"
import { AppContext } from "../App"
import { InputGroup } from "../components/ui/input-group"
import { Anime } from "../types"
import { FaPlay } from "react-icons/fa";   
import Mousetrap from "mousetrap"
import { Link } from "react-router-dom"

const AnimePage = () => {
  const {anime, setAnime} = useContext(AppContext)
  const [searchQuery,setSearchQuery] = useState<string>("")
  // const [searchedAnime, setSearchedAnime] = useState<Movies[]>([])

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const searchAnime = async()=>{
    const resp = await axios.get(`${import.meta.env.VITE_SERVER}/anime?s=${searchQuery}`,{
      withCredentials: true
    })
    
    const data:Anime[] = resp.data
    setAnime(data)
  }

  
  const search = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (searchQuery.length > 1) {
        searchAnime()
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

    return () => {
      Mousetrap.unbind(['command+/', 'ctrl+/'])
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
        <Group attached>
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
                  name="search-anime"
            />
          </InputGroup>
          <InputAddon
            onClick={searchAnime}
            cursor={"pointer"}
          > 
            search
          </InputAddon>
        </Group>
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
          anime && anime.length!==0?(
            <>
              <Table.ScrollArea borderWidth="2px" rounded="md" w={"100%"} height="100%">
                <Table.Root size="lg" stickyHeader interactive showColumnBorder>
                  <Table.Header>
                    <Table.Row bg="bg.subtle" >
                      <Table.ColumnHeader textAlign={"center"} w={"2%"}>No.</Table.ColumnHeader>
                      <Table.ColumnHeader textAlign={"center"} w={"74%"}>Name</Table.ColumnHeader>
                      <Table.ColumnHeader textAlign={"center"} w={""}>Size</Table.ColumnHeader>
                      <Table.ColumnHeader textAlign={"center"} w={""}>Seeders</Table.ColumnHeader>
                      <Table.ColumnHeader textAlign={"center"} w={"5%"}></Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                        
                  <Table.Body>
                    {anime.map((a,i) => (
                      <Table.Row key={i}>
                        <Table.Cell textAlign={"center"}>{i+1}</Table.Cell>
                        <Table.Cell whiteSpace={"normal"}>{a.name}</Table.Cell>
                        <Table.Cell textAlign={"center"}>{a.size}</Table.Cell>
                        <Table.Cell textAlign={"center"}>{a.seeders}</Table.Cell>
                        <Table.Cell>
                          <Link to={`/player?magnet=${encodeURIComponent(a.magnetLink)}`}>
                            <Button size={"xs"}>
                              <FaPlay/>Stream
                            </Button>
                          </Link>
                          </Table.Cell>
                        </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Table.ScrollArea>

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
                  searchQuery.length===0?(
                    <Text fontSize={"lg"} color={"darkturquoise"} fontWeight={"bolder"}>
                      Turn on VPN to search for anime.
                    </Text>
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

export default AnimePage