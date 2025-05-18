'use client'

import {
  Flex,
  Box,
  Image,
  

} from '@chakra-ui/react'
import { Popover } from "@chakra-ui/react"
import { useColorMode } from "../components/ui/color-mode";
import { Magnet, Movies } from '../types';
import { Tooltip } from './ui/tooltip';


const ToolTipContent = ({magnetLinks}:{magnetLinks:Magnet[]})=>{
    return (
    <Box display="flex" flexDirection="column" gap={2}>
      {magnetLinks.map((item, i) => (
        <Box
          key={`${item.quality}-${item.size}-${i}`}
          bg="gray.700"
          color="white"
          px={3}
          py={1}
          borderRadius="md"
          fontSize="sm"
        >
          <strong>{item.quality}</strong> — {item.size}
        </Box>
      ))}
    </Box>
    )
}


function MovieCard2({title, imgUrl, magnets}:Movies) {

    const {colorMode} = useColorMode()
    
  return (
      <Box
        bg={colorMode == 'light' ? 'white' : 'gray.800'}
        maxW="280px"
        h={"390px"}
        borderWidth="1px"
        rounded="lg"
        shadow="lg"
        >
        <Tooltip content={<ToolTipContent magnetLinks={magnets}/>} interactive>
        <Box>
            <Image src={imgUrl} alt={`Picture of ${title}`} roundedTop="lg"   maxW="270px" objectFit={"fill"} w={"260px"} h={"300px"}/>

            <Box p="2"  h={"22%"} flexDirection={"column"} alignContent={"center"}>
                <Box
                fontSize="2xl"
                fontWeight="semibold"
                as="h4"
                lineHeight="tight"
                textAlign={"center"}
                cursor={"pointer"}
                mt={4}
                >
                    <Box>
                        {title}
                    </Box>
                </Box>
            </Box>
        </Box>
        </Tooltip>
      </Box>
  )
}

export default MovieCard2