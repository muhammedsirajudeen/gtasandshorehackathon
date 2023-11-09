import axios from "axios";
import { useState } from "react";
import ClockLoader from "react-spinners/ClockLoader"
export default function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmpassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading,setLoading]=useState(false)
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

    return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold mb-4 w-full text-center ">Sign Up</h2>
        <div className="mb-4">
          <input
            type="text"
            className="w-full px-4 py-2 border rounded focus:outline-none"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            className="w-full px-4 py-2 border rounded focus:outline-none"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            className="w-full px-4 py-2 border rounded focus:outline-none"
            placeholder="Confirm Password"
            value={confirmpassword}
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
        </div>
        <p className="text-red-500 mb-4">{message}</p>
        <button
          onClick={signupHandler}
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-full w-full hover:bg-blue-600 focus:outline-none"
        >
          Sign Up
        </button>
        <div className="w-full flex justify-center ">
            <ClockLoader loading={loading} color={"#000000"}/>
        </div>
      </div>
    </div>
  );
}
