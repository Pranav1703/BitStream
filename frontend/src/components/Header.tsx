import { Box, Button, HStack, Text} from "@chakra-ui/react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { AppContext } from "../App"
import { useContext } from "react"
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "./ui/menu"
import { FaUser } from "react-icons/fa6";
import { ColorModeButton } from "./ui/color-mode"


const ProfileMenu = ({username,logoutHandler}:{username:string,logoutHandler:()=>Promise<void>})=>{

  return(
    <MenuRoot>
    <MenuTrigger asChild>
      <Button variant="subtle" colorPalette={"bg"} p={2} borderRadius={"50px"}>
      <FaUser color="#76ABAE"/>
      </Button>
    </MenuTrigger>
    <MenuContent>
      <MenuItem value="user">Hi, {username}!</MenuItem>
      <MenuItem value="Edit">Edit Profile</MenuItem>
      <MenuItem
        value="logout"
        color="fg.error"
        _hover={{ bg: "bg.error", color: "fg.error" }}
        onClick={logoutHandler}
      >
        Logout
      </MenuItem>
    </MenuContent>
  </MenuRoot>
  )
}

const Header = () => {
    const navigate = useNavigate()
    const {user,setUser} = useContext(AppContext)
  
    const logout = async()=>{
      try {
        await axios.get(`${import.meta.env.VITE_SERVER}/logout`,{
          withCredentials:true
        })
        setUser("")
        navigate("/login")
      } catch (error) {
        console.log(error)
      }
    }

    const navItems = [
      { name: "Movies", path: "/" },
      { name: "Anime", path: "/anime" },
      { name: "My List", path: "/mylist" },
    ]

  return (
    <Box 
    w={"100%"} 
    h={"70px"}
    display={"flex"}
    flexDirection={"row"}
    alignItems={"center"}
    justifyContent={"space-between"}
    px={12}
    borderBottom={"1px solid #403c3c"}
    >
        <Text fontFamily={"Bungee"} color={"darkturquoise"}>
          BitStream
        </Text>
        <HStack w={"30%"} justifyContent={"space-around"}>
          {/* <Text color={{base:"black", _dark:"teal"}} fontWeight={700}>Movies</Text>
          <Text color={{base:"black", _dark:"teal"}} fontWeight={700}>Anime</Text>
          <Text color={{base:"black", _dark:"teal"}} fontWeight={700}>My List</Text> */}
          {navItems.map(({ name, path }) => (
            <Text
              key={path}
              color={location.pathname === path ? "teal.500" : "gray"}
              fontWeight={location.pathname === path ? "bold" : 500}
              borderBottom={location.pathname === path ? "2px solid teal" : "none"}
              cursor="pointer"
              _hover={{ color: "teal.400" }}
              onClick={() => navigate(path)}
            >
              {name}
            </Text>
            ))}
        </HStack>
        <Box display={"flex"} w={"120px"} justifyContent={"space-around"}>
          <ColorModeButton />
          <ProfileMenu username={user} logoutHandler={logout}/>
        </Box>
    </Box>
  )
}

export default Header
