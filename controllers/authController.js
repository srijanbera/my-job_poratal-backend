import User from "../models/userModel.js"
import {generateToken, hashPassword } from "../helper/authHelper.js";
import bcrypt from "bcrypt";
import companyModel from "../models/companyModel.js";
import jobSeekerModel from "../models/jobSeekerModel.js";


export const signup = async (req, res) => {
    try{
        const {name, email, phoneno, password, user_type} = req.body;
        if (!name || !email || !phoneno || !password || !user_type === undefined) {
            return res.status(400).json({ message: "All fields are required." });
        }
        const existingUser = await User.findOne({ $or: [{email}, {phoneno}] })
        if(existingUser){
            return res.status(400).json({message: "User Already exists"});
        }
        const hashedPassword = await hashPassword(password);

        const newUser = new User({name, email, phoneno, password: hashedPassword, user_type});
        const savedUser = await newUser.save();

        if(user_type === 2){
            
            const companyUser = new companyModel({ company_id: savedUser._id, email: savedUser.email, phone: "", location: "", website: "", industry: "", description: "", established_year: ""});
            await companyUser.save();
            
        }
        else if(user_type === 1){
            const jobSeekerUser = new jobSeekerModel({ jobseeker_id: savedUser._id, address: "", phone: savedUser.phoneno, resume: "", skills: "", job_filter_id: null, experience: [], education: [], socialLinks: {} });
            await jobSeekerUser.save();
        }
        else{
            res.status(400).json({ message: "User type invalid" });
        }

        res.status(201).json({message: "User Registered Successfully", user: newUser});
    }catch(error){
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
}

export const signin = async (req, res) => {
    try{
        const {emailPhone, password} = req.body;

        if(!emailPhone || !password){
            return res.status(400).json({ message: "Email/Phone and Password are required." });
        }
        const user = await User.findOne({ $or: [{email: emailPhone}, {phoneno: emailPhone}]})
        if(!user){
            return res.status(404).json({ message: "User not found." });
        }
        if (user.status === 0) {
            return res.status(403).json({ message: "Your account is inactive. Please contact support." });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password." });
        }

        // const token = jwt.sign({ id: user._id, user_type: user.user_type }, process.env.JWT_SECRET, {
        //     expiresIn: "7d", 
        // });
        const token = generateToken(user._id, user.user_type);
        // console.log(token);
      res.status(200).json({
        message: "Login successful!",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phoneno: user.phoneno,
          user_type: user.user_type,
        },
      });
    }catch(error){
        console.error("SignIn Error:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
}