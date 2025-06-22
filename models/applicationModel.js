import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    jobSeekerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobSeekerDetails",
      required: true,
    },
    resume: {
      type: String,
      required: true,
      trim: true,
    },
    tracking_status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "under review"],
      default: "pending", // Status of the application
    },
    status: {
        type: Number,
        enum: [0, 1], // 0=inactive, 1=active
        default: 1,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Application", ApplicationSchema);
 