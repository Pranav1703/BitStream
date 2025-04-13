import { Box, Input, VStack, Text, Button } from "@chakra-ui/react"
import {
  PasswordInput,
  PasswordStrengthMeter,
} from "../components/ui/password-input"
import { Link } from "react-router-dom"
import { useContext, useState } from "react"
import axios, { AxiosError } from "axios"
import { AppContext } from "../App"
import { Tooltip } from "../components/ui/tooltip"

const Login = () => {
  
  const [username,setUsername] = useState<string>("")
  const [pass,setPass] = useState<string>("")
  const [msg,setMsg] = useState<string>("")
  const [passStrength,setPassStrength] = useState<number>(0) 
  const {setUser} = useContext(AppContext)
  const [showTooltip, setShowTooltip] = useState(false);


  const passwordToolTip = `Password should contain:
    • At least one special character.
    • Should contain numbers.
    • Should contain a Capital Letter.`;

  const handlePasswordChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const value = e.target.value
    setPass(value)
    let strength = 1;
  
    if (/[A-Z]/.test(value)) strength++; 
    if (/\d/.test(value) && value.length > 8) strength++;    
    if (/[@#$*&_-]/.test(value) && value.length > 8) strength++;
    if (value.length >= 8) strength++;  


    setPassStrength(strength)
  
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
        const resp = err.response?.data
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
          <Text fontSize={"x-large"} fontWeight={"bolder"}>Login</Text>
          <Input placeholder="Enter Username" name="username" autoComplete={"on"} value={username} onChange={(e)=>setUsername(e.target.value)}  w={"350px"} variant={"flushed"}/>
          <Tooltip 
            open={showTooltip}
            positioning={{placement:'right'}} 
            showArrow 
            content={<Box whiteSpace={"pre-line "}>{passwordToolTip}</Box>}
          >
            <PasswordInput 
              placeholder="Enter Password" 
              name="password" 
              value={pass} 
              onChange={(e)=>handlePasswordChange(e)} 
              variant={"flushed"}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            />
          </Tooltip>
          <PasswordStrengthMeter max={5} value={passStrength} w={"100%"}/>
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