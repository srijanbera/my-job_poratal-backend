//jobSeekerModel.js
import mongoose from "mongoose";

const JobSeekerSchema = new mongoose.Schema(
  {
    jobseeker_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      type: String,
      trim: true,
      maxlength: [200, "Address cannot exceed 200 characters"],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\d{10}$/, "Phone number must be exactly 10 digits"],
    },
    resume: {
      type: String, // URL or path to the resume file
      trim: true,
    },
    skills: {
      type: [String], // Array of skills like "JavaScript", "React", etc.
      default: [],
    },
    job_filter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job_filter'
    },
    experience: [
      {
        company: { type: String, trim: true, required: true },
        position: { type: String, trim: true, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date }, // Nullable if it's the current job
        isCurrent: { type: Boolean, default: false }, // Boolean flag for ongoing job
        description: { type: String, trim: true }, // Job responsibilities or summary
      },
    ],
    education: [
      {
        institution: { type: String, required: true, trim: true }, // University/College Name
        degree: { type: String, required: true, trim: true }, // Bachelor's, Master's, etc.
        fieldOfStudy: { type: String, required: true, trim: true }, // Computer Science, Business, etc.
        startYear: { type: Number, required: true }, // Year of enrollment
        endYear: { type: Number }, // Graduation year (nullable for ongoing studies)
        grade: { type: String, trim: true }, // GPA or percentage
        additionalInfo: { type: String, trim: true }, // Certifications, honors, etc.
      },
    ],
    socialLinks: {
      linkedin: { type: String, trim: true },
      github: { type: String, trim: true },
      portfolio: { type: String, trim: true },
    },
    status: {
      type: Number,
      enum: [0, 1], // 0=inactive, 1=active
      default: 1,
    },
  },
  { timestamps: true }
);

export default mongoose.model("JobSeekerDetails", JobSeekerSchema);
 