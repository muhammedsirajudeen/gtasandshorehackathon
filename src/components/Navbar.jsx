import { signOut } from "next-auth/react"
export default function Navbar({username}){
    return(
        <div className="flex w-screen items-center justify-evenly m-3">
            <div className=" font-bold">PROTOTYPE</div>
            <div className=" font-bold">{username}</div>
            <button onClick={()=>signOut()}  className=" bg-custombgcolor text-white text-xs h-8 w-14 rounded-lg font-light">signout</button>
        </div>
    )
}