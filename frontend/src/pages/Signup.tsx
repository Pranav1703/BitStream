import { Box, VStack, Input,Text, Button } from "@chakra-ui/react"
import { PasswordInput, PasswordStrengthMeter } from "../components/ui/password-input"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import axios from "axios"

const Signup = () => {

  const [username,setUsername] = useState<string>("")
  const [p1,setP1] = useState<string>("")
  const [p2,setP2] = useState<string>("")
  const [msg,setMsg] = useState<string>("")

  
  const checkFields = ():boolean=>{
    if(username && p1 && p2){
        if(p1 === p2) {
            return true
        }else{
            setMsg("Password does not match.")
            return false
        }
    }else{
        return false
    }

  }

  const submit = async()=>{
    if(checkFields()){
        await axios.post(`${import.meta.env.VITE_SERVER}/signup`,{
          username,
          password: p1
        })
        setUsername("")
        setP1("")
        setP2("")
    }
    return
  }

  return (
    <Box h={"100vh"} w={"100vw"} display={"flex"}>
      
      <VStack 
        minW={"250px"} 
        minH={"300px"}
        m={'auto'} 
        borderRadius={"md"} 
        justify={"space-evenly"}
        
        >
            <Text fontSize={"x-large"} fontWeight={"bolder"} borderBottom={"2px solid white"} >Sign Up</Text>
            <Input placeholder="Enter Username" value={username} onChange={(e)=>setUsername(e.target.value)} w={"350px"} variant={"flushed"}/>
            <PasswordInput placeholder="Enter Password" value={p1} onChange={(e)=>setP1(e.target.value)} variant={"flushed"}/>
            <PasswordStrengthMeter value={1} w={"100%"}/>
            <PasswordInput placeholder="Confirm Password" value={p2} onChange={(e)=>setP2(e.target.value)} variant={"flushed"}/>
            <Text>
              {msg}
            </Text>
            <Button
            onClick={submit}
            >
              SignUp
            </Button>
            <Text>
              Already a user? <Link to={"/login"}>Login</Link>       
            </Text>

        </VStack> 

    </Box>
  )
}

export default Signup