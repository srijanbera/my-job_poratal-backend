import express from "express";
import { contactus } from "../controllers/contactusController.js";

const router = express.Router();

router.post("/contact", contactus);

export default router;