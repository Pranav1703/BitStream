import { Box, Button, Group, Input, InputAddon } from "@chakra-ui/react"


const MyList = () => {
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
              name="search-anime"
        />
        <InputAddon
        onClick={()=>{}}
        >
            Add
        </InputAddon>
      </Group>
    </Box>
  )
}

export default MyList