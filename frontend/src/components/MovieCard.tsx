import { Box, HStack, Image, Text } from "@chakra-ui/react"
import { FaPlay } from "react-icons/fa";
const MovieCard = () => {

  return (
    <Box
    border={"1px solid green"}
    borderRadius={"15px"}
    maxW={"300px"}
    maxH={"400px"}
    h={"400px"}
    w={"300px"}
    p={"15px"}
    display={"flex"}
    flexDirection={"column"}
    bgColor={""}
    fontWeight={400}
    justifyContent={"space-around"}
    >
        <Image src="https://www.5movierulz.ag/uploads/Blue-Whale-Telugu.jpg"  maxH={"270px"} objectFit={"contain"}/>
        <Text textAlign={"center"}>Blue Whale</Text>
        <HStack
        justifyContent={"space-around"}
        >
            <Box
            display={"flex"}
            alignItems={"center"}
            >
                <FaPlay/>
                <Text ml={"5px"}>1080p</Text>
            </Box>

            <Box>                   
                <Text>720p</Text>
            </Box>
        </HStack>
    </Box>

  )
}

export default MovieCard