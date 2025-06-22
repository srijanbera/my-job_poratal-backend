//jobModel.js
import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    job_filter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job_filter",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [100, "Job title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
      maxlength: [1000, "Job description cannot exceed 1000 characters"],
    },
    location: {
      type: String,
      required: [true, "Job location is required"],
      trim: true,
    },
    salary: {
      type: String,
      trim: true,
    },
    job_type: {
      type: String,
      enum: ['part-time', 'full-time', 'freelance'], // Corrected typo and added better types
      required: [true, "Job type is required"],
    },
    shift_schedule: {
      type: [String], // Example: "Day Shift", "Night Shift"
      default: [],
    },
    benefits: {
      type: [String], // Example: "Health Insurance", "Flexible Working Hours"
      default: [],
    },
    education: {
      type: [String], // Example: "Bachelor's in Computer Science", "Diploma in IT"
      default: [],
    },
    experience: {
      type: String, // Example: "2+ years of experience in Software Development"
      trim: true,
    },
    deadline: {
      type: Date, // Corrected typo ("dadeline" to "deadline")
      required: [true, "Application deadline is required"],
    },
    status: {
        type: Number,
        enum: [0, 1], // 0=inactive, 1=active
        default: 1,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", JobSchema);
 