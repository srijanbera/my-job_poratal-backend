import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export const hashPassword = async (password) => {
    try{
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }catch(error){
        throw new Error("Error hashing password");
    }
}

export const generateToken = (userId, userType) => {
    try{
        const token = jwt.sign({id: userId, user_type: userType},process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );
        return token;
    }catch(error){
        throw new Error("Failed to generate token");
    }
}
 
export const verifyToken = (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error("Token verification failed:", error);
      return null;
    }
};
   