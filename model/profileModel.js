import mongoose from "mongoose";

let profileModel;

if (mongoose.models && mongoose.models.profileModel) {
  profileModel = mongoose.models.profileModel;
} else {
    const courseSchema=new mongoose.Schema(
        {
            coursename:String,
            completedlevel:{
                type:Number,
                default:0
            }
                }
    )
    const profileSchema=new mongoose.Schema(
        {
            username:String,
            enrolledcourses:[courseSchema] | null
        }
    )

  profileModel = mongoose.model('profileModel', profileSchema);
}

export default profileModel;