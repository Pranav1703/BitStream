import { Box, Input, VStack, Text, Button } from "@chakra-ui/react"
import {
  PasswordInput,
  PasswordStrengthMeter,
} from "../components/ui/password-input"
import { Link } from "react-router-dom"
import { useState } from "react"
import axios from "axios"

const Login = () => {
  
  const [username,setUsername] = useState<string>("")
  const [pass,setPass] = useState<string>("")
  const [msg,setMsg] = useState<string>("")

  const submit = ()=>{
    if(username && pass){
      try {
        axios.post(`${import.meta.env.VITE_SERVER}/login`,{
          username,
          pass
        })
      } catch (error) {
        console.log(error)
        setMsg(`${error}`)
      }

    }else{
      setMsg("Fill all Fields")
    }
  }


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
          <Input placeholder="Enter Username" value={username} onChange={(e)=>setUsername(e.target.value)} w={"350px"} variant={"flushed"}/>
          <PasswordInput placeholder="Enter Password" value={pass} onChange={(e)=>setPass(e.target.value)} variant={"flushed"}/>
          <PasswordStrengthMeter value={1} w={"100%"}/>
          <Text>
            {msg}
          </Text>
          <Button
          onClick={submit}
          >
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