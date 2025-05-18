import { Image,Box, Text, Button, Card } from "@chakra-ui/react"
import { FaPlay } from "react-icons/fa";    
import { Link } from "react-router-dom";
import { Movies } from "../types";
import { useColorMode } from "../components/ui/color-mode";
import { useEffect, useState } from "react";
const MovieCard = ({title,imgUrl,magnets}:Movies) => {

  const { colorMode } = useColorMode();
  const [btnMode,setBtnMode] = useState<string>("play-btn-dark")
  useEffect(() => {
    if(colorMode=="light"){
      setBtnMode("play-btn-light")
    }else{
      setBtnMode("play-btn-dark")
    }
  }, [colorMode])
  

  return (

    <Card.Root w={"270px"} maxW="270px" maxH={"400px"} overflow="auto" _light={{bg:"EEEEEE", border:"2px solid #76ABAE"}} _dark={{bg:"gray.800"}} m={"8px"}>
      <Image
        src={imgUrl}
        alt={title}
        maxH={"250px"}
        objectFit={"contain"}
        mt={"15px"}
        borderRadius={"5px"}
      />
      <Card.Body gap="2" _light={{bg:"EEEEEE",color:"rgb(44, 174, 181)"}} _dark={{bg:"gray.800"}} pt={"12px"}>
        <Card.Title 
        textAlign={"center"} 
        display={"inline-block"} 
        whiteSpace={"nowrap"}
        overflow={"hidden"}
        textOverflow="ellipsis"
        title={title}
        >
          {title}
        </Card.Title>
        {/* <Card.Description>
        </Card.Description> */}
      </Card.Body>
      <Card.Footer gap="2" maxW={"280px"} display={"flex"} justifyContent={"space-around"}>
        {
          magnets.map((magnet,i)=>(
            <Box key={i}>
              <Button variant="outline" size={"xs"} p={1} className={`play-btn ${btnMode}`}>
                <span>
                  <FaPlay/>
                  <Link to={`/player?magnet=${encodeURIComponent(magnet.link)}`}>
                    <Text ml={"1px"}>{magnet.quality}</Text>
                  </Link>
                </span>
              </Button>
            </Box>
          ))
        }
      </Card.Footer>
    </Card.Root>

  )
}

export default MovieCard