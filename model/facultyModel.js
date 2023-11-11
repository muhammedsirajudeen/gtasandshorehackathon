import mongoose from "mongoose";

let facultyModel;

if (mongoose.models && mongoose.models.facultyModel) {
  facultyModel = mongoose.models.facultyModel;
} else {

    const facultySchema=new mongoose.Schema(
        {
            username:String,
            bio:String,
            cover:String,
            faculty:Boolean,
            socialLinks:String
        }

    )

  facultyModel = mongoose.model('facultyModel', facultySchema);
}

export default facultyModel;