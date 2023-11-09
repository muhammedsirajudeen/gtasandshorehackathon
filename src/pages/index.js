import axios from "axios"
import { useEffect } from "react"


export default  function Home() {
  useEffect(()=>{
    async function getData(){
      let response=(await axios.get("/api/hello")).data
      console.log(response)
    }
    getData()
  },[])
  return (
    <div>hello world</div>
  )
}
