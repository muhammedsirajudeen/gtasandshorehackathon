import mongoose from "mongoose";

let courseModel;

if (mongoose.models && mongoose.models.courseModel) {
  courseModel = mongoose.models.courseModel;
} else {
    const courselevelSchema=new mongoose.Schema(
        {
            level:Number,
            videourl:String
        }
    )
    const profileSchema=new mongoose.Schema(
        {
            coursename:String,
            levels:[courselevels],
            courseauthor:String
        }
    )

  courseModel = mongoose.model('courseModel', profileSchema);
}

export default courseModel;