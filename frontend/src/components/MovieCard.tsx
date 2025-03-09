import { Image, Text, Button, Card } from "@chakra-ui/react"
import { motion } from "framer-motion";
import { FaPlay } from "react-icons/fa";    


export type Movies = {
  Title: string
  ImgUrl : string
  Magnets : {
    Link: string
    Size: string
    Quality: string
  }[]
}

const MotionText = motion(Card.Title);

const MovieCard = ({Title,ImgUrl,Magnets}:Movies) => {

  return (

    <Card.Root w={"270px"} maxW="270px" maxH={"400px"} overflow="auto" bg="gray.800" m={"8px"}>
      <Image
        src={ImgUrl}
        alt={Title}
        maxH={"250px"}
        objectFit={"contain"}
        mt={"15px"}
      />
      <Card.Body gap="2" bg="gray.800" pt={"10px"}>
        <Card.Title 
        textAlign={"center"} 
        display={"inline-block"} 
        whiteSpace={"nowrap"}
        overflow={"hidden"}
        textOverflow="ellipsis"

        >
          {Title}
        </Card.Title>
        {/* <Card.Description>
        </Card.Description> */}
      </Card.Body>
      <Card.Footer gap="2" maxW={"280px"} display={"flex"} justifyContent={"space-around"}>
        {
          Magnets.map((magnet,i)=>(
            <>
              <Button key={i} variant="solid" size={"xs"} p={1}>
                <FaPlay/>
                <Text ml={"1px"}>{magnet.Quality}</Text>
              </Button>
            </>
          ))
        }
      </Card.Footer>
    </Card.Root>

  )
}

export default MovieCard