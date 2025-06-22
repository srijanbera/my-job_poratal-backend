import express from "express";
import { getJobSeekerProfile, getRelevantJobs, updateJobSeeker } from "../controllers/jobSeekerController.js";

const router = express.Router();

router.post("/update-jobseeker", updateJobSeeker);
router.get("/relevant", getRelevantJobs);
router.get("/get-jobseeker", getJobSeekerProfile);

export default router;