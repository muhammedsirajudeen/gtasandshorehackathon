import { useRef, useState } from "react"
import axios from "axios"
export default function Tag({setcurrentTag,setCourses}){
    const [tag,setTage]=useState(["WebDevelopment","CyberSecurity","DigitalMarketing"])
    const clicked=useRef(false)
    return(
        <div className="flex justify-evenly w-full h-10 items-center">
                    {tag.map((value)=>{
                        return(
                            <div onClick={(e)=> {
                                setcurrentTag(e.target.id)
                                async function getCourses(){
                                    if(!clicked.current){
                                       
                                        let response=(await axios.get(`/api/course/getCourse?tag=${e.target.id}`)).data
                                        if(response.message==="success"){
                                            setCourses(response.courses)
                                        }else{
                                            setCourses([])
                                        }
                                        clicked.current=true


                                    }

 
                                    else{
                                        let response=(await axios.get(`/api/course/getCourse`)).data
                                        if(response.message==="success"){
                                            setCourses(response.courses)
                                        }else{
                                            setCourses([])
                                        }
                                        clicked.current=false
                                    }

                                }
                                getCourses()
                                
                                if(document.querySelector(`#${e.target.id}`).style.backgroundColor==="green"){
                                    document.querySelector(`#${e.target.id}`).style.backgroundColor="white"
                                    document.querySelector(`#${e.target.id}`).style.color="black"
                                }
                                else if(document.querySelector(`#${e.target.id}`).style.backgroundColor="white"){
                                    document.querySelector(`#${e.target.id}`).style.backgroundColor="green"
                                    document.querySelector(`#${e.target.id}`).style.color="black"
                                    
                                }

                            }} id={value} className="border rounded-lg text-xs font-light "> {value} </div>    

                        )
                    }) }
        </div>

    )   
}