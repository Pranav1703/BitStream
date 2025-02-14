import { Box} from "@chakra-ui/react"
import { Link} from "react-router-dom"
import Header from "../components/Header"

const Home = () => {

  return (
    <>
    <Header/>
    <Box>
      <Link to={"/player"}>player</Link>
      <br />
      Home  
    </Box>
    </>
  )
}

export default Home