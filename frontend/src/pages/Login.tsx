import { Box, Input, VStack, Text, Button } from "@chakra-ui/react"
import {
  PasswordInput,
  PasswordStrengthMeter,
} from "../components/ui/password-input"
import { Link } from "react-router-dom"

const Login = () => {
  
  return (
    <Box h={"100vh"} w={"100vw"} display={"flex"}>
      
      <VStack 
        minW={"250px"} 
        minH={"300px"}
        m={'auto'} 
        borderRadius={"md"} 
        // border={"0px solid rgb(237, 235, 235)"}
        justify={"space-evenly"}
        
        >
          <Text fontSize={"x-large"} fontWeight={"bolder"}>Login</Text>
          <Input placeholder="Enter Username" w={"350px"} variant={"flushed"}/>
          <PasswordInput placeholder="Enter Password" variant={"flushed"}/>
          <PasswordStrengthMeter value={1} w={"100%"}/>
          <Button>
            Login
          </Button>
          <Text>
            new user? <Link to={"/signup"}>Sign up</Link>
          </Text>
        </VStack> 

    </Box>
  )
}

export default Login