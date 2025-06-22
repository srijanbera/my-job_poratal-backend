import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please provide a valid email address"],
    },
    phone: {
        type: String,
        trim: true,
        match: [/^\d{10}$/, "Phone number must be exactly 10 digits"],
    },
    location: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
      match: [/^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6})(\/[^\s]*)?$/, "Please provide a valid website URL"],
    },
    industry: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    established_year: {
      type: Number,
      min: [1800, "Year must be later than 1800"],
      max: [new Date().getFullYear(), "Year cannot be in the future"],
    },
    status: {
        type: Number,
        enum: [0, 1], // 0=inactive, 1=active
        default: 1,
      },
  },
  { timestamps: true }
);

export default mongoose.model("Company", CompanySchema);

 