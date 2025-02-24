import { Box} from "@chakra-ui/react"
import { Link} from "react-router-dom"

const Home = () => {

  return (
    <>
    <Box
      marginTop={"50px"}
      marginLeft={"100px"}
      marginRight={"100px"}
      border={"1px solid teal"}
      h={"85vh"}
    >
      <Link to={"/player"}>player</Link>
      <br />
      Home  
    </Box>
    </>
  )
}

export default Home