import { Image, Text, Button, Card } from "@chakra-ui/react"
import { FaPlay } from "react-icons/fa";    

type CardProps = {
  title: string
  imgUrl : string
  magnetLinks : {
    link: string
    info: string
  }
}

const MovieCard = () => {

  return (

    <Card.Root w={"270px"} maxW="270px" maxH={"400px"} overflow="auto" bg="gray.800" m={"8px"}>
      <Image
        src="https://www.5movierulz.ag/uploads/Blue-Whale-Telugu.jpg"
        alt="movie title"
        maxH={"250px"}
        objectFit={"contain"}
        mt={"15px"}
      />
      <Card.Body gap="2" bg="gray.800" p={"18px"}>
        <Card.Title textAlign={"center"}>MOvie Title</Card.Title>
        {/* <Card.Description>
        </Card.Description> */}
      </Card.Body>
      <Card.Footer gap="2" maxW={"280px"} display={"flex"} justifyContent={"space-around"}>
        <Button variant="solid" size={"xs"}>
          <FaPlay/>
          <Text ml={"5px"}>1080p</Text>
        </Button>
        <Button variant="solid" size={"xs"}>
          <FaPlay/>
          <Text ml={"5px"}>1080p</Text>
        </Button>


      </Card.Footer>
    </Card.Root>

  )
}

export default MovieCard

// import { Box, HStack, Image, Text, Button, Card } from "@chakra-ui/react"
// import { motion } from "framer-motion"
// import { FaPlay } from "react-icons/fa";    

// // Motion-enhanced components
// const MotionBox = motion(Box)
// const MotionButton = motion(Button)

// const MovieCard = () => {
//   return (
//     <MotionBox
//       whileHover={{ scale: 1.05, boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)" }}
//       transition={{ duration: 0.3 }}
//       maxW="300px"
//       maxH="400px"
//       overflow="hidden"
//       borderRadius="15px"
      
//       color="white"
//     >
//       <Image
//         src="https://www.5movierulz.ag/uploads/Blue-Whale-Telugu.jpg"
//         alt="movie title"
//         maxH="250px"
//         objectFit="contain"
//       />
//       <Box p="3">
//         <Text textAlign="center" fontSize="xl" fontWeight="bold">
//           Blue Whale
//         </Text>
//       </Box>

//       <HStack p="3" justifyContent="space-around">
//         <MotionButton
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           animate={{ y: [0, -2, 0] }} // Subtle bounce effect
//           transition={{ duration: 0.5, repeat: Infinity }}
//           variant="solid"
//           size="xs"
//           bg="teal.500"
//         >
//           <FaPlay />
//           <Text ml="5px">1080p</Text>
//         </MotionButton>

//         <MotionButton
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           animate={{ y: [0, -2, 0] }}
//           transition={{ duration: 0.5, repeat: Infinity }}
//           variant="solid"
//           size="xs"
//           bg="blue.500"
//         >
//           <FaPlay />
//           <Text ml="5px">720p</Text>
//         </MotionButton>
//       </HStack>
//     </MotionBox>
//   )
// }

// export default MovieCard
