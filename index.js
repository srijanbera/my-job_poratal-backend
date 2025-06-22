// index.js
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import jobseekerRoutes from "./routes/jobSeekerRoutes.js"
import applicationRoutes from "./routes/applicationRoutes.js"
import contactusRoutes from "./routes/contactusRoutes.js"

dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({
    origin: '*'
}));

app.get('/',(req, res) => {
    res.send("Hii Their");
})
app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/jobseeker", jobseekerRoutes);
app.use("/api/job-application", applicationRoutes);
app.use("/api/contactus", contactusRoutes);

const port = process.env.port || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

 