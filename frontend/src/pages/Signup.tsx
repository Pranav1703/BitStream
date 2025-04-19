import { Box, VStack, Input,Text, Button } from "@chakra-ui/react"
import { PasswordInput, PasswordStrengthMeter } from "../components/ui/password-input"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import axios, { AxiosError } from "axios"
import { Tooltip } from "../components/ui/tooltip"

const Signup = () => {

  const [username,setUsername] = useState<string>("")
  const [p1,setP1] = useState<string>("")
  const [p2,setP2] = useState<string>("")
  const [msg,setMsg] = useState<string>("")
  const [showTooltip, setShowTooltip] = useState(false);
  const [passStrength,setPassStrength] = useState<number>(0) 

  const navigate = useNavigate()

  const passwordToolTip = `Password should contain:
    • At least one special character.
    • Should contain numbers.
    • Should contain a Capital Letter.`;

  const handlePasswordChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const value = e.target.value
    setP1(value)
    let strength = 1;

    if (/[A-Z]/.test(value)) strength++; 
    if (/\d/.test(value) && value.length > 8) strength++;    
    if (/[@#$*&_-]/.test(value) && value.length > 8) strength++;
    if (value.length >= 8) strength++;  


    setPassStrength(strength)
  }


  const checkFields = ():boolean=>{
    if(username && p1 && p2){
        if(p1 === p2) {
            return true
        }else{
            setMsg("Password does not match.")
            return false
        }
    }else{
      setMsg("Fill all fields")
        return false
    }

  }

  const submit = async()=>{
    if(checkFields()){
      try {
        const resp = await axios.post(`${import.meta.env.VITE_SERVER}/signup`,{
          username: username.trim(),
          password: p1.trim()
        })
        console.log(resp)
        setUsername("")
        setP1("")
        setP2("")
        navigate("/login")
      } catch (error) {
          console.log(error)
          const err = error as AxiosError
          const resp = err.response?.data
          setMsg(`${resp}`)
      }
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
            <Text fontSize={"x-large"} fontWeight={"bolder"} color={"teal.400"}>SignUp</Text>
            <Input placeholder="Enter Username" name="username" value={username} onChange={(e)=>setUsername(e.target.value)} w={"350px"} variant={"flushed"}/>
            <Tooltip 
            open={showTooltip}
            positioning={{placement:'right'}} 
            showArrow 
            content={<Box whiteSpace={"pre-line "}>{passwordToolTip}</Box>}
            >
            <PasswordInput 
              placeholder="Enter Password" 
              name="password" 
              value={p1} 
              onChange={(e)=>handlePasswordChange(e)} 
              variant={"flushed"}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            />
            </Tooltip>
            <PasswordStrengthMeter max={5} value={passStrength} w={"100%"}/>
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
              Already a user? 
              <Link to={"/login"}>
                <Text as="span" color="teal.400" fontWeight="bold" textDecoration="underline" pl={1}>
                   Login
                </Text>
              </Link>       
            </Text>

        </VStack> 

    </Box>
  )
}

export default Signup