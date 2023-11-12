import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [image, setImage] = useState("");
  const [username, setUsername] = useState("");
  const [facultystatus, setFacultystatus] = useState(false);
  const [enrolledcourses, setEnrolledcourses] = useState([]);

  useEffect(() => {
    async function getProfile() {
      let response = (await axios.get("/api/getResource/profile")).data;
      setImage(response.profile);
      setUsername(response.username);
    }

    async function getFacultyStatus() {
      let response = (await axios.get("/api/getResource/getfacultyStatus")).data;
      if (response.facultystatus) {
        setFacultystatus(true);
      }
    }

    async function getAllCourses() {
      let response = (await axios.get("/api/course/getallCourses")).data;
      setEnrolledcourses(response.enrolledcourses);
    }

    getProfile();
    getFacultyStatus();
    getAllCourses();
  }, []);

  function upgradeHandler() {
    window.location.href = "/upgrade/facultyupgrade";
  }

  function uploadHandler() {
    window.location.href = "/upload/courseupload";
  }

  function deleteHandler(courseId) {
    // Add code to delete course data with courseId
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-start">
      <Navbar />
      <div className="bg-green-800 rounded-lg w-80 h-52 flex flex-col items-center justify-evenly text-white shadow-lg p-6">
        <img
          src={image}
          className="rounded-full mt-3 border border-white p-1"
          width={60}
          height={60}
          alt="Profile"
        />
        <p className="font-bold mt-3">{username}</p>
        {facultystatus ? (
          <button
            className="bg-white text-black font-bold rounded-lg py-2 px-4"
            onClick={uploadHandler}
          >
            Upload
          </button>
        ) : (
          <button
            onClick={upgradeHandler}
            className="bg-white text-black font-bold rounded-lg mt-3 py-2 px-4"
          >
            Upgrade
          </button>
        )}
      </div>
      <p className="w-screen font-bold text-center m-5">ENROLLED COURSES</p>
      {enrolledcourses.map((value) => (
        <div
          className="flex justify-evenly items-center m-5 border border-black rounded-lg shadow-md p-4"
          key={value._id}
        >
          <div className="font-bold m-3">COURSE NAME:</div>
          <div>{value.coursename}</div>
          <div className="font-bold m-3">COMPLETED STATUS</div>
          <div>{value.completedlevel ? "Completed" : "Pending"}</div>
          <button
            onClick={() => deleteHandler(value._id)}
            className="bg-red-500 text-white p-2 rounded-md"
          >
            DELETE
          </button>
        </div>
      ))}
    </div>
  );
}
