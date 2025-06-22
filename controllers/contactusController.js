import Contactus from "../models/contactusModel.js";
import nodemailer from "nodemailer";
import { verifyToken } from "../helper/authHelper.js";
import dotenv from "dotenv";

dotenv.config();

export const contactus = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized Token" });
        }

        const decode = verifyToken(token);
        if (!decode) {
            return res.status(401).json({ message: "Token Invalid" });
        }

        const { name, email, phone, subject, message } = req.body;

        // Save to Database (multiple entries allowed)
        const savedData = await Contactus.create({
            name, email, phone, subject, message
        });

        // Setup nodemailer
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email, // send to user's email entered in form
            subject: 'Thank You for Contacting Us!',
            text: `Hi ${name},

            Thank you for reaching out. We have received your message:

            Subject: ${subject}
            Message: ${message}

            We’ll get back to you soon!

            Best regards,
            GIM`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Error sending email:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Saved to database, but email sending failed.',
                    error: err
                });
            }

            res.status(200).json({
                success: true,
                message: 'Form submitted successfully and email sent!',
                data: savedData,
                emailInfo: info
            });
        });

    } catch (error) {
        console.error("Error processing Contact Us:", error);
        res.status(500).json({
            success: false,
            message: "Server Error: Failed to submit Contact Us",
            error: error.message
        });
    }
};
