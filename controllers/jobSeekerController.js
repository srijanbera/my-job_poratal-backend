import { verifyToken } from "../helper/authHelper.js";
import jobSeekerModel from "../models/jobSeekerModel.js";
import jobModel from "../models/jobModel.js";

export const getJobSeekerProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decode = verifyToken(token);
    if (!decode) {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (decode.user_type !== 1) {
      return res.status(403).json({ message: "Forbidden: Only job seekers can access this route" });
    }

    // Find job seeker details and populate the user info
    const jobSeeker = await jobSeekerModel.findOne({ jobseeker_id: decode.id }).populate("jobseeker_id");

    if (!jobSeeker) {
      return res.status(404).json({ message: "Job Seeker profile not found" });
    }

    res.status(200).json({
      user: {
        name: jobSeeker.jobseeker_id.name,
        email: jobSeeker.jobseeker_id.email,
        phoneno: jobSeeker.jobseeker_id.phoneno,
        user_type: jobSeeker.jobseeker_id.user_type,
        status: jobSeeker.jobseeker_id.status,
      },
      address: jobSeeker.address,
      phone: jobSeeker.phone,
      resume: jobSeeker.resume,
      skills: jobSeeker.skills,
      job_filter_id: jobSeeker.job_filter_id,
      experience: jobSeeker.experience,
      education: jobSeeker.education,
      socialLinks: jobSeeker.socialLinks,
      status: jobSeeker.status
    });

  } catch (error) {
    console.error("Error fetching job seeker profile:", error);
    res.status(500).json({ message: "Server Error. Please try again later." });
  }
};




export const updateJobSeeker = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized Token" });
    }

    const decode = verifyToken(token);
    if (!decode) {
      return res.status(401).json({ message: "Token Invalid" });
    }

    if (decode.user_type !== 1) {
      return res.status(403).json({ message: "Forbidden: Only job seekers can update profile" });
    }

    const jobseeker_id = decode.id;

    const {
      address,
      phone,
      resume,
      skills,
      job_filter_id,
      experience,
      education,
      socialLinks
    } = req.body;

    const jobSeeker = await jobSeekerModel.findOne({ jobseeker_id });
    if (!jobSeeker) {
      return res.status(404).json({ message: "Job Seeker not found" });
    }

    // Update fields if provided
    if (address) jobSeeker.address = address;
    if (phone) jobSeeker.phone = phone;
    if (resume) jobSeeker.resume = resume;
    if (skills) jobSeeker.skills = skills;
    if (job_filter_id) jobSeeker.job_filter_id = job_filter_id;
    if (experience) jobSeeker.experience = experience;
    if (education) jobSeeker.education = education;
    if (socialLinks) jobSeeker.socialLinks = socialLinks;

    const updatedJobSeeker = await jobSeeker.save();

    res.status(200).json({
      message: "Job seeker profile updated successfully",
      updatedJobSeeker,
    });

  } catch (error) {
    console.error("Update Job Seeker Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

 



export const getRelevantJobs = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Ensure only job seekers can fetch relevant jobs
    if (decoded.user_type !== 1) {
      return res.status(403).json({ message: "Forbidden: Only job seekers can access this route" });
    }

    const jobSeeker = await jobSeekerModel.findOne({ jobseeker_id: decoded.id });

    if (!jobSeeker) {
      return res.status(404).json({ message: "Job Seeker profile not found" });
    }

    // let jobs = [];

    // if (!jobSeeker.job_filter_id) {
    //   // If job_filter_id is NULL -> fetch all active jobs
    //   jobs = await jobModel.find({ status: 1 })
    //                   .populate("companyId")
    //                   .populate("job_filter_id");
    // } else {
    //   // If job_filter_id is set -> fetch relevant jobs
    //   jobs = await jobModel.find({
    //             status: 1,
    //             job_filter_id: jobSeeker.job_filter_id
    //           })
    //           .populate("companyId")
    //           .populate("job_filter_id");
    // }

    const jobs = await jobModel.find()
                               

    return res.status(200).json({
      success: true,
      total: jobs.length,
      jobs
    });

  } catch (error) {
    console.error("Error fetching relevant jobs:", error);
    res.status(500).json({ success: false, message: "Server Error. Please try again later." });
  }
};
