import express from "express";
import {  getAllJobsFilter, getCompanyDetails, getCompanyJobs, getJobApplicants, updateCompany } from "../controllers/companyController.js";

const router = express.Router();

router.post("/update-company", updateCompany);
router.get("/get-company-details", getCompanyDetails);
router.get("/get-company-job", getCompanyJobs);
router.get("/get-job-applicants/:jobId", getJobApplicants);
router.get("/get-jobs-filter", getAllJobsFilter);

export default router;
