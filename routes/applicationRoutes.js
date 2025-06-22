import express from "express";
import { applyForJob, createJob, updateJob } from "../controllers/applicationController.js";

const router = express.Router();

router.post("/create-job", createJob);
router.post("/update-job", updateJob)
router.post("/apply", applyForJob);

export default router;


