import { Box, Button, Group, Input, InputAddon, Table } from "@chakra-ui/react"
import axios from "axios"
import { useEffect, useState } from "react"
import {Link} from "react-router-dom"
import { FaPlay } from "react-icons/fa"; 

const MyList = () => {

  const [magnet,setMagnet] = useState("")
  const [myList,setMyList] = useState([])
  const addMagnet = async()=>{
    try {
      const res = await axios.post(`${import.meta.env.VITE_SERVER}/magnet/add`,{
        magnet: magnet
      },{
        withCredentials:true
      })

    } catch (error) {
      console.log(error)
    }
  }
  
  const getList = async()=>{
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER}/magnet/list`,{
        withCredentials:true
      })
      setMyList(res.data)
      console.log(res.data)
    } catch (error) {
      console.log(error)
    }
  }
  

  return (
    <Box
        marginTop={"50px"}
        marginLeft={"100px"}
        marginRight={"100px"}
        border={"1px solid teal"}
        h={"85vh"}
    >
      <Group attached>
        <Input placeholder="Add magnet link" 
              w={"550px"}
              borderWidth={"2px"}
              name="add-magnet"
              value={magnet}
              onChange={(e)=>setMagnet(e.target.value)}

        />
        <InputAddon
        onClick={addMagnet}
      
        >
            Add
        </InputAddon>
      </Group>
      <Table.ScrollArea borderWidth="2px" rounded="md" w={"100%"} height="100%">
        <Table.Root size="lg" stickyHeader interactive showColumnBorder>
          <Table.Header>
            <Table.Row bg="bg.subtle" >
              <Table.ColumnHeader textAlign={"center"} w={"2%"}>No.</Table.ColumnHeader>
              <Table.ColumnHeader textAlign={"center"} w={"74%"}>Name</Table.ColumnHeader>
              <Table.ColumnHeader textAlign={"center"} w={""}>Size</Table.ColumnHeader>
              {/* <Table.ColumnHeader textAlign={"center"} w={""}>Seeders</Table.ColumnHeader> */}
              <Table.ColumnHeader textAlign={"center"} w={"8%"}></Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
                
          <Table.Body>
            {myList.map((e,i) => (
              <Table.Row key={i}>
                <Table.Cell textAlign={"center"}>{i+1}</Table.Cell>
                <Table.Cell whiteSpace={"normal"}>{}</Table.Cell>
                <Table.Cell textAlign={"center"}>{}</Table.Cell>
                {/* <Table.Cell textAlign={"center"}>{}</Table.Cell> */}
                <Table.Cell>
                  <Link to={`/player?magnet=${encodeURIComponent("")}`}>
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
    </Box>
  )
}

export default MyList