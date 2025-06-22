import Job from "../models/jobModel.js";
import { verifyToken } from "../helper/authHelper.js";
import Application from "../models/applicationModel.js";
import JobSeeker from "../models/jobSeekerModel.js";  

export const createJob = async (req, res) => {
  try {
    // 1. Extract token from headers
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    // 2. Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // 3. Check if user is a company
    if (decoded.user_type !== 2) {
      return res.status(403).json({ message: "Forbidden: Only companies can post jobs" });
    }

    // 4. Create new job using request body
    const {
      job_filter_id,
      title,
      description,
      location,
      salary,
      job_type,
      shift_schedule,
      benefits,
      education,
      experience,
      deadline,
    } = req.body;

    const newJob = new Job({
      companyId: decoded.id, // Taken from token
      job_filter_id,
      title,
      description,
      location,
      salary,
      job_type,
      shift_schedule,
      benefits,
      education,
      experience,
      deadline,
    });

    const savedJob = await newJob.save();
    return res.status(201).json({ message: "Job created successfully", job: savedJob });

  } catch (error) {
    console.error("Create Job Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
 
export const updateJob = async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized Token" });
      }
  
      const decode = verifyToken(token);
      if (!decode) {
        return res.status(401).json({ message: "Token Invalid" });
      }
  
      if (decode.user_type !== 2) {
        return res.status(403).json({ message: "Forbidden: Only companies can update jobs" });
      }
  
      const companyId = decode.id;
      
      const {
        jobId,
        title,
        description,
        location,
        salary,
        job_type,
        shift_schedule,
        benefits,
        education,
        experience,
        deadline,
        status
      } = req.body;
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
  
      if (job.companyId.toString() !== companyId) {
        return res.status(403).json({ message: "You are not authorized to update this job" });
      }
  
      if (title) job.title = title;
      if (description) job.description = description;
      if (location) job.location = location;
      if (salary) job.salary = salary;
      if (job_type) job.job_type = job_type;
      if (shift_schedule) job.shift_schedule = shift_schedule;
      if (benefits) job.benefits = benefits;
      if (education) job.education = education;
      if (experience) job.experience = experience;
      if (deadline) job.deadline = deadline;
      if (status !== undefined) job.status = status;
  
      const updatedJob = await job.save();
  
      res.status(200).json({
        message: "Job updated successfully",
        updatedJob,
      });
  
    } catch (error) {
      console.error("Update Job Error:", error);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
};

   // Your JobSeekerDetails model

export const applyForJob = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // Only job seekers (user_type === 1) can apply
    if (decoded.user_type !== 1) {
      return res.status(403).json({ message: "Forbidden: Only job seekers can apply for jobs" });
    }

    const jobSeekerId = decoded.id;
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    // Fetch resume from JobSeeker profile
    const jobSeeker = await JobSeeker.findOne({ jobseeker_id: jobSeekerId });

    if (!jobSeeker) {
      return res.status(404).json({ message: "Job Seeker profile not found" });
    }

    const resume = jobSeeker.resume;
    if (!resume) {
      return res.status(400).json({ message: "Resume not found in your profile. Please upload your resume first." });
    }

    // Check for duplicate application
    const alreadyApplied = await Application.findOne({ jobId, jobSeekerId });
    if (alreadyApplied) {
      return res.status(409).json({ message: "You have already applied for this job" });
    }

    const newApplication = new Application({
      jobId,
      jobSeekerId,
      resume,   // Automatically using the resume from JobSeekerDetails
    });

    const savedApplication = await newApplication.save();

    res.status(201).json({
      message: "Job application submitted successfully",
      application: savedApplication,
    });

  } catch (error) {
    console.error("Apply for Job Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
