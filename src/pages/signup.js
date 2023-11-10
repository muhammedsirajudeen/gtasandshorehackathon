import axios from "axios";
import { useState } from "react";
import ClockLoader from "react-spinners/ClockLoader"
import { signIn } from "next-auth/react";
import Image from "next/image";
export default function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmpassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading,setLoading]=useState(false);
    async function signupHandler() {
        if (password !== confirmpassword) {
        setMessage("Passwords do not match");
        return;
        } else if (username.length < 8) {
        setMessage("Username must be at least 8 characters");
        return;
        } else if (password.length < 8) {
        setMessage("Password must be at least 8 characters");
        return;
        }

        try {
            setLoading(true)
            const response = await axios.post("/api/serverauth/signup", {
                username: username,
                password: password,
            });

            console.log(response.data);
            setMessage(response.data.message);
            setLoading(false)

        if (response.data.message === "success") {
            setLoading(false)
            window.location.href = "api/auth/signin";
        }
        } catch (error) {
            console.error("Error:", error);
            setLoading(false)
            setMessage("An error occurred.");
        }
    }
    async function googleHandler(){
      signIn("google")
    }

    return (
    <div className=" bg-customcolor min-h-screen flex items-center justify-center">
      <div className=" text-white  bg-custombgcolor  rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold mb-4 w-full text-center ">Sign Up</h2>
        <div className="mb-4">
          <input
            type="text"
            className=" bg-custombgcolor w-full px-4 py-2 border rounded focus:outline-none"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            className=" bg-custombgcolor w-full px-4 py-2 border rounded focus:outline-none"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            className=" bg-custombgcolor w-full px-4 py-2 border rounded focus:outline-none"
            placeholder="Confirm Password"
            value={confirmpassword}
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
        </div>
        <p className="text-red-500 mb-4">{message}</p>
        <button
          onClick={signupHandler}
          className="bg-custombgcolor border text-white font-semibold py-2 px-4  rounded-lg w-full hover:bg-blue-600 focus:outline-none"
        >
          Sign Up
        </button>
        <p className="w-full text-center mt-3 font-extrabold text-xl  " >  or</p>
        <div className="flex items-center justify-center mt-5 ">
          <button className=" bg-white text-black w-52 h-10 rounded-lg font-light text-lg flex items-center justify-between " onClick={googleHandler} >
            <Image src="/google.svg" width={20} height={20} className="ml-3"  ></Image>
            <p className="font-light mr-3 ">signin with google</p>
          </button>
        </div>
        <div className="w-full mt-5 flex justify-end">
          <a className="font-bold "  href="/api/auth/signin"> continue to login...</a>
        </div>

        <div className="w-full flex justify-center ">
            <ClockLoader loading={loading} color={"#FFFFFF"}/>
        </div>
      </div>
    </div>
  );
}
