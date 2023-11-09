export default function Handler(req,res){
    //add the signin in logic here
    if(req.method==="POST"){
        res.status(200).json({message:"hello world"})
    }
}