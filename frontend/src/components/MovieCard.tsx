'use client'

import {
  Flex,
  Box,
  Image,
  Popover, 
  Portal ,
  Table
} from '@chakra-ui/react'
import { useColorMode } from "./ui/color-mode";
import { Magnet, Movies } from '../types';

import { FaPlay } from "react-icons/fa"; 
import { Link } from 'react-router-dom';

type PopOptionsProps = {
  name: string
  magnetLinks: Magnet[]
}

const BottomPart = ({name,magnetLinks}:PopOptionsProps) => {
  return (
    <Popover.Root positioning={{ placement: "bottom-end" }} size={"lg"}>
      <Popover.Trigger asChild>
        <Box
        maxW={"240px"}
        whiteSpace={"nowrap"}
        overflow={"hidden"}
        textOverflow="ellipsis"               
        >
          {name}
        </Box>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Arrow />
            <Popover.Body p={2}>
               <Table.Root size="lg" stickyHeader>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>Quality</Table.ColumnHeader>
                      <Table.ColumnHeader>Size</Table.ColumnHeader>
                      <Table.ColumnHeader textAlign="end"></Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {magnetLinks.map((l,i) => (
                      <Table.Row key={i}>
                        <Table.Cell>{l.quality}</Table.Cell>
                        <Table.Cell>{l.size}</Table.Cell>
                        <Table.Cell textAlign="end" cursor={"pointer"}>
                          <Link to={`/player?magnet=${encodeURIComponent(l.link)}`}>
                            <FaPlay/>
                          </Link>
                          
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
}



function MovieCard({title, imgUrl, magnets}:Movies) {

    const {colorMode} = useColorMode()
    
  return (
      <Box
        bg={colorMode == 'light' ? 'white' : 'gray.800'}
        maxW="280px"
        h={"390px"}
        borderWidth="1px"
        rounded="lg"
        shadow="lg"
        m={3}
        >

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
                whiteSpace={"nowrap"}
                overflow={"hidden"}
                >
                    {/* <Box>
                        {title}
                    </Box> */}
                    <BottomPart name={title} magnetLinks={magnets}/>
                </Box>
            </Box>
        </Box>
      </Box>
  )
}

export default MovieCard