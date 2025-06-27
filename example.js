
 
import Company from "../models/companyModel.js";
import User from "../models/userModel.js";
import { verifyToken } from "../helper/authHelper.js";

export const createCompany = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided." });
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized: Invalid token." });
    }
    
    const { email, phone, location, website, industry, description, established_year } = req.body;

    if (!email || !location) {
      return res.status(400).json({ message: "Email and location are required." });
    }

    const user = await User.findById(decoded.id);
    if (!user || user.user_type !== 2) {
      return res.status(403).json({ message: "Unauthorized: Access denied." });
    }

    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({ message: "Company already exists." });
    }

    const newCompany = new Company({
      company_id: decoded.id,
      email,
      phone,
      location,
      website,
      industry,
      description,
      established_year,
    });

    const savedCompany = await newCompany.save();

    res.status(201).json({
      message: "Company created successfully!",
      company: savedCompany,
    });
  } catch (error) {
    console.error("Error creating company:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided." });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized: Invalid token." });
    }

    const { company_id } = req.params;
    const { email, phone, location, website, industry, description, established_year } = req.body;

    const company = await Company.findOne({ company_id });
    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }

    if (company.company_id.toString() !== decoded.id) {
      return res.status(403).json({ message: "Unauthorized: Access denied." });
    }

    if (email) company.email = email;
    if (phone) company.phone = phone;
    if (location) company.location = location;
    if (website) company.website = website;
    if (industry) company.industry = industry;
    if (description) company.description = description;
    if (established_year) company.established_year = established_year;

    const updatedCompany = await company.save();

    res.status(200).json({
      message: "Company updated successfully!",
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Error updating company:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};



























import JobSeekerDetails from "../models/jobSeekerModel.js";
import User from "../models/userModel.js";
import { verifyToken } from "../helper/authHelper.js";

export const createJobSeeker = async (req, res) => {
  try {
    // Verify the token
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided." });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized: Invalid token." });
    }

    const { jobseeker_id, address, phone, resume, skills, job_filter_id, experience, education, socialLinks, status } = req.body;

    // Validate if jobseeker_id exists and belongs to a user with user_type = 1 (job seeker)
    const user = await User.findById(jobseeker_id);
    if (!user || user.user_type !== 1) {
      return res.status(404).json({ message: "User not found or is not a job seeker." });
    }

    // Check if job seeker details already exist for the user
    const existingJobSeeker = await JobSeekerDetails.findOne({ jobseeker_id });
    if (existingJobSeeker) {
      return res.status(400).json({ message: "Job seeker details already exist." });
    }

    // Create a new job seeker details instance
    const newJobSeeker = new JobSeekerDetails({
      jobseeker_id,
      address,
      phone,
      resume,
      skills,
      job_filter_id,
      experience,
      education,
      socialLinks,
      status,
    });

    // Save the job seeker details to the database
    const savedJobSeeker = await newJobSeeker.save();

    res.status(201).json({
      message: "Job seeker details created successfully!",
      jobSeeker: savedJobSeeker,
    });
  } catch (error) {
    console.error("Error creating job seeker details:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};


export const updateJobSeeker = async (req, res) => {
  try {
    // Verify the token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided." });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized: Invalid token." });
    }

    const { jobseeker_id } = req.params;


    const { address, phone, resume, skills, job_filter_id, experience, education, socialLinks, status } = req.body;

    // Validate if jobseeker_id exists and belongs to a user with user_type = 1 (job seeker)
    const user = await User.findById(jobseeker_id);
    if (!user || user.user_type !== 1) {
      return res.status(404).json({ message: "User not found or is not a job seeker." });
    }

    // Find existing job seeker details
    const existingJobSeeker = await JobSeekerDetails.findById(jobseeker_id);
    if (!existingJobSeeker) {
      return res.status(404).json({ message: "Job seeker details not found." });
    }

    // Update only the provided fields
    if (address) existingJobSeeker.address = address;
    if (phone) existingJobSeeker.phone = phone;
    if (resume) existingJobSeeker.resume = resume;
    if (skills) existingJobSeeker.skills = skills;
    if (job_filter_id) existingJobSeeker.job_filter_id = job_filter_id;
    if (experience) existingJobSeeker.experience = experience;
    if (education) existingJobSeeker.education = education;
    if (socialLinks) existingJobSeeker.socialLinks = socialLinks;
    if (typeof status !== "undefined") existingJobSeeker.status = status;

    // Save the updated details to the database
    const updatedJobSeeker = await existingJobSeeker.save();

    res.status(200).json({
      message: "Job seeker details updated successfully!",
      jobSeeker: updatedJobSeeker,
    });
  } catch (error) {
    console.error("Error updating job seeker details:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

 
 