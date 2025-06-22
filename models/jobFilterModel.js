//jobFilterModel.js
import mongoose from "mongoose";

const JobFilterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        enum: [0, 1], // 0=inactive, 1=active
        default: 1,
      },
  },
  { timestamps: true }
)

export default mongoose.model("Job_filter", JobFilterSchema);

 