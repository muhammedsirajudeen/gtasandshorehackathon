import mongoose from "mongoose";

let liveModel;

if (mongoose.models && mongoose.models.liveModel) {
  liveModel = mongoose.models.liveModel;
} else {

    const liveSchema=new mongoose.Schema(
        {
            tutorname:String,
            sessionname:String,
            sessiondescription:String,
            offer:String,
            icecandidates:[String]
        }
    )

  liveModel = mongoose.model('liveModel', liveSchema);
}

export default liveModel;