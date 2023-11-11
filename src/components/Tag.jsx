import { useState } from "react"

export default function Tag({setcurrentTag}){
    const [tag,setTage]=useState(["WebDevelopment","CyberSecurity","DigitalMarketing"])
    return(
        <div className="flex justify-evenly w-full h-10 items-center">
                    {tag.map((value)=>{
                        return(
                            <div onClick={(e)=> {
                                setcurrentTag(e.target.id)
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