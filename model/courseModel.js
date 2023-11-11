import mongoose from "mongoose";

let courseModel;

if (mongoose.models && mongoose.models.courseModel) {
  courseModel = mongoose.models.courseModel;
} else {

    const profileSchema=new mongoose.Schema(
        {
            coursename:String,
            coursedescription:String,
            coursevideo:String,
            courseauthor:String
        }
    )

  courseModel = mongoose.model('courseModel', profileSchema);
}

export default courseModel;