import { Box, Input, VStack, Text, Button } from "@chakra-ui/react"
import {
  PasswordInput,
} from "../components/ui/password-input"
import { Link } from "react-router-dom"
import { useContext, useState } from "react"
import axios, { AxiosError } from "axios"
import { AppContext } from "../App"


const Login = () => {
  
  const [username,setUsername] = useState<string>("")
  const [pass,setPass] = useState<string>("")
  const [msg,setMsg] = useState<string>("")

  const {setUser} = useContext(AppContext)


  const handlePasswordChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const value = e.target.value
    setPass(value)
  }

  const submit = async()=>{

    if(username && pass){
      
      try {
        const resp = await axios.post(`${import.meta.env.VITE_SERVER}/login`,{
          username: username.trim(),
          password: pass.trim()
        },{
          withCredentials: true
        })
        console.log(resp)
        
        setUser(username)

      } catch (error) {
        console.log(error)
        const err = error as AxiosError
        const resp = err.message
        setMsg(`${resp}`)
      }
      setUsername("")
      setPass("")

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
          <Text fontSize={"x-large"} fontWeight={"bolder"} color={"teal.400"}>Login</Text>
          <Input placeholder="Enter Username" name="username" autoComplete={"on"} value={username} onChange={(e)=>setUsername(e.target.value)}  w={"350px"} variant={"flushed"}/>
          <PasswordInput 
            placeholder="Enter Password" 
            name="password" 
            value={pass} 
            onChange={(e)=>handlePasswordChange(e)} 
            variant={"flushed"}
          />
          <Text>
            {msg}
          </Text>
          <Button
          onClick={submit}
          >
            Login
          </Button>
          <Text>
            new user? 
            <Link to={"/signup"}>
              <Text as="span" color="teal.400" fontWeight="bold" textDecoration="underline" pl={1}>
                 SignUp
              </Text>
            </Link>
          </Text>
        </VStack> 
    </Box>
  )
}

export default Login