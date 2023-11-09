import axios from "axios"
import { useEffect, useState } from "react"


export default  function Home() {
  const [name,setName]=useState("")
  useEffect(()=>{
    async function getData(){
      let response=(await axios.get("/api/hello")).data
      console.log(response)
      setName(response.name)
    }
    getData()
  },[])
  return (
    <div>hello world {name} </div>
  )
}
