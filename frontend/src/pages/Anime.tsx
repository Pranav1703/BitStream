import { Box, HStack, Input, Kbd, Spinner, Table } from "@chakra-ui/react"
import axios from "axios"
import { useContext, useState, useRef, useEffect } from "react"
import { LuSearch } from "react-icons/lu"
import { AppContext } from "../App"
import { InputGroup } from "../components/ui/input-group"
import { Anime } from "../types"
import Mousetrap from "mousetrap"

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
  
  
const items = [
  { id: 1, name: "1", category: "Electronics", price: 999.99 },
  { id: 2, name: "1", category: "Home Appliances", price: 49.99 },
  { id: 3, name: "1", category: "Furniture", price: 150.0 },
  { id: 4, name: "1", category: "Electronics", price: 799.99 },
  { id: 5, name: "1", category: "Accessories", price: 199.99 },
  { id: 5, name: "1", category: "Accessories", price: 199.99 },
  { id: 5, name: "1", category: "Accessories", price: 199.99 },
  { id: 5, name: "1", category: "Accessories", price: 199.99 },
  { id: 5, name: "1", category: "Accessories", price: 199.99 },
  { id: 5, name: "1", category: "Accessories", price: 199.99 },
  { id: 5, name: "1", category: "Accessories", price: 199.99 },
  { id: 5, name: "1", category: "Accessories", price: 199.99 },
  { id: 5, name: "1", category: "Accessories", price: 199.99 },
  { id: 5, name: "1", category: "Accessories", price: 199.99 },
  { id: 5, name: "1", category: "Accessories", price: 199.99 },
  { id: 5, name: "1", category: "Accessories", price: 199.99 },
]

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
                borderWidth={"2px"}
                onKeyDown={search}
                name="search-anime"
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
          anime.length===0?(
            <>
              {/* {
                anime.map((movie,i)=>(
                  <>
                  
                  </>
                ))
              } */}

              <Table.ScrollArea borderWidth="2px" rounded="md" w={"100%"} height="100%">
                <Table.Root size="lg" stickyHeader interactive showColumnBorder>
                  <Table.Header>
                    <Table.Row bg="bg.subtle" >
                      <Table.ColumnHeader textAlign={"center"} w={"3%"}>No.</Table.ColumnHeader>
                      <Table.ColumnHeader textAlign={"center"}>Name</Table.ColumnHeader>
                      <Table.ColumnHeader textAlign={"center"}>Price</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                        
                  <Table.Body>
                    {items.map((item) => (
                      <Table.Row key={item.id}>
                        <Table.Cell>{item.name}</Table.Cell>
                        <Table.Cell>{item.category}</Table.Cell>
                        <Table.Cell>{item.price}</Table.Cell>
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