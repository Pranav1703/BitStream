import { Box, Button, Group, Input, InputAddon } from "@chakra-ui/react"
import axios from "axios"
import { useEffect, useState } from "react"


const MyList = () => {

  const [magnet,setMagnet] = useState("")
  const test = async()=>{
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
      console.log(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getList()
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
        onClick={test}
      
        >
            Add
        </InputAddon>
      </Group>
    </Box>
  )
}

export default MyList