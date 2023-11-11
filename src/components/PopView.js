export default function PopView({id,setOpen}){
    return(
        <div className="fixed flex top-0 bottom-0 justify-center items-center   w-screen h-screen border  rounded-lg ">
            <div className="flex justify-start flex-col bg-white border border-black  items-center w-96 h-96 ">
            <buttton className="font-bold"  onClick={()=> setOpen(false) }> X </buttton>

            </div>
        </div>
    )
}