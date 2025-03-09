import { Box, HStack } from "@chakra-ui/react"
import MovieCard from "../components/MovieCard"


const Movies = () => {
  return (
    <Box
    marginTop={"50px"}
    marginLeft={"100px"}
    marginRight={"100px"}
    h={"85vh"}
    >
      <HStack
      padding={"10px"}
      w={"100%"}
      wrap={"wrap"}
      overflow={"auto"}
      >
        <MovieCard/>
        <MovieCard/>
        <MovieCard/>
        <MovieCard/>
        <MovieCard/>
        <MovieCard/>
        <MovieCard/>
        <MovieCard/>
        <MovieCard/>
        <MovieCard/>
        <MovieCard/>
        <MovieCard/>
      </HStack>
      
    </Box>
  )
}

export default Movies