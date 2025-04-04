import { Box, Button, Group, Input, InputAddon, Table } from "@chakra-ui/react"
import axios from "axios"
import { useContext, useEffect, useState } from "react"
import {Link} from "react-router-dom"
import { FaPlay } from "react-icons/fa"; 
import { AppContext } from "../App";
import { MdDelete } from "react-icons/md";

const MyList = () => {

  const [magnet,setMagnet] = useState("")

  const {userList,setUserList} = useContext(AppContext)

  const addMagnet = async()=>{
    try {
      const res = await axios.post(`${import.meta.env.VITE_SERVER}/magnet/add`,{
        magnet: magnet
      },{
        withCredentials:true
      })
      console.log("magnet added.",res)
      await getList()
    } catch (error) {
      console.log(error)
    }
    
  }
  
  const getList = async()=>{
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER}/magnet/list`,{
        withCredentials:true
      })

      setUserList(res.data)
      console.log(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const deleteEntry = async(link:string)=>{
    try {
      const res = await axios.post(`${import.meta.env.VITE_SERVER}/magnet/delete`,{
        magnet: link
      },{
        withCredentials:true
      })

      console.log("magnet deleted.",res)
      await getList()
    } catch (error) {
      console.log(error)
    }
    
  }

  useEffect(() => {
  
    if(userList.length===0){
      console.log("fetching userList...");
      (async()=>{
        await getList()
      })();
    }else{
      console.log("resuing fetched list :",userList);
    }

  }, [])
  


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
              <Table.ColumnHeader textAlign={"center"} w={"8%"}></Table.ColumnHeader>
              <Table.ColumnHeader textAlign={"center"} w={"3%"}></Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
                
          <Table.Body>
            {userList && userList.map((e,i) => (
              <Table.Row key={i}>
                <Table.Cell textAlign={"center"}>{i+1}</Table.Cell>
                <Table.Cell whiteSpace={"normal"}>{e.Name}</Table.Cell>
                <Table.Cell textAlign={"center"}>{e.Size}</Table.Cell>
                
                <Table.Cell>
                  <Link to={`/player?magnet=${encodeURIComponent(`${e.Link}`)}`}>
                    <Button size={"xs"}>
                      <FaPlay/>Stream
                    </Button>
                  </Link>
                </Table.Cell>
                <Table.Cell textAlign={"center"}>
                  <Button size={"xs"} onClick={()=>deleteEntry(e.Link)}>
                  <MdDelete/>
                  </Button>
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