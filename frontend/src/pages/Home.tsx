import { Button } from "@chakra-ui/react"
import axios from "axios"
import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { UserContext } from "../App"


const Home = () => {

  const navigate = useNavigate()
  const {setUser} = useContext(UserContext)

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

  return (
    <div>
      <Link to={"/player"}>player</Link>Home
      <Button
      onClick={logout}
      >
        logout
        </Button>  
    </div>
  )
}

export default Home