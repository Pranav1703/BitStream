import { Box } from "@chakra-ui/react"
import MovieCard from "../components/MovieCard"


const Movies = () => {
  return (
    <Box
    marginTop={"50px"}
    marginLeft={"100px"}
    marginRight={"100px"}
    border={"1px solid teal"}
    h={"85vh"}
    padding={"10px"}
    >
      <MovieCard/>
    </Box>
  )
}

export default Movies