import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please provide a valid email address"],
    },
    phoneno: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      match: [/^\d{10}$/, "Phone number must be exactly 10 digits"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    user_type: {
      type: Number,
      enum: [0, 1, 2], // 0=admin, 1=job_seeker, 2=company
      default: 1,
    },
    status: {
      type: Number,
      enum: [0, 1], // 0=inactive, 1=active
      default: 1,
    },
  },
  { timestamps: true }
);

// Add static or instance methods if needed later
export default mongoose.model("User", UserSchema);

 