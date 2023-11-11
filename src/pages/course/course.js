import { useEffect, useState } from "react";
import axios from "axios";
import Tag from "@/components/Tag";
import Navbar from "@/components/Navbar";
import PopView from "@/components/PopView";
export default function Course(){
    const [currentTag,setcurrentTag]=useState("WebDevelopment")
    const [courses,setCourses]=useState([])
    const [open,setOpen]=useState(false)
    const [id,setId]=useState("")
    useEffect(()=>{
        async function getCourses(){
            let response=(await axios.get("/api/course/getCourse")).data
            console.log(response)
            if(response.message==="success"){
                setCourses(response.courses)

            }
        }
        getCourses()
    },[])

    function enrollHandler(e){
        setId(e.target.id)
        setOpen(true)
    }


    return(
        <>
        <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Tag setCourses={setCourses} setcurrentTag={setcurrentTag} />
        <div className={`container mx-auto py-8 ${open? "blur" :""} `}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {courses.map((value) => (
              <div
                key={value._id}
                className="bg-white p-6 rounded-md shadow-md"
              >
                <h2 className="text-xl font-bold mb-4">{value.coursename}</h2>
                <p className="text-gray-600 mb-4">{value.coursedescription}</p>
                <p className="text-gray-800 font-bold mb-2">
                  Author: {value.courseauthor}
                </p>
                <button onClick={enrollHandler}  className="bg-blue-500 text-white px-4 py-2 rounded-full">
                  Enroll
                </button>
              </div>
            ))}
          </div>
        </div>
        {open? <PopView id={id} setOpen={setOpen}  /> :<></>  }
      </div>
       
        </>

    )
}