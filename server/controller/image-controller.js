import user from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


export const registercode = async (req, res) => {
    try {
        const { username, password, confirm_password, email } = req.body;

        if (!(username && password && confirm_password && email)) {
            res.status(400).send("Please enter all the information");
        }


        const existing_user2 = await user.findOne({ username });
        if (existing_user2) {
            res.status(400).send("username is already in use");
        }

        const existing_user1 = await user.findOne({ email });
        if (existing_user1) {
            res.status(400).send("Email is already in Use");
        }

        if (password != confirm_password) {
            res.status(400).send("Password do not match");
        }

        if (password.length < 8) {
            res.status(400).send("Password must contain atleast 8 letters");
        }


        const hashed_password = await bcrypt.hash(password, 10);
        // save the user in database
        await user.create({
            username: username,
            password: hashed_password,
            email: email,

        });


        res.status(200).json({ message: 'you have successfully registered' });
    } catch (error) {
        console.log("user registration is unsuccessful", error.message);
        res.status(500).json({
            message: "Internal server error. Registration unsuccessful.",
            error: error.message
        });
    }

}

export const logincode = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            res.status(400).send("Please enter all the information");
        }

        const founduser = await user.findOne({ email });


        if (!founduser) {
            res.status(400).send("user doesn't exist");
        }

        const password_match = await bcrypt.compare(password, founduser.password);

        if (!password_match) {
            res.status(400).send("Incorrect password");
        }

        const token = jwt.sign({
            id: founduser._id, email: founduser.email, username: founduser.username, role: founduser.role
        }, process.env.SECRET_KEY,
            {
                expiresIn: "3hr"
            });
        founduser.password = undefined;
        res.status(200).json({ message: 'you have successfully logged in', token: token });

    } catch (error) {
        console.error("Login failed:", error.message);
        res.status(500).json({
            message: "Internal server error. login unsuccessful.",
            error: error.message
        });
    }

}

export const forgotpasswordcode = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Please enter required information" });
        }

        const founduser = await user.findOne({ email });

        if (!founduser) {
            return res.status(400).json({ message: "User doesn't exist" });
        }


        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        founduser.resetOtp = otp;
        founduser.resetOtpExpires = otpExpiry;
        await founduser.save();


        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: founduser.email,
            subject: 'Password Reset OTP',
            html: `
                <h2>Password Reset OTP</h2>
                <p>Hello ${founduser.username},</p>
                <p>Your OTP for password reset is <b>${otp}</b>. It is valid for 10 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'OTP sent to your email.' });

    } catch (error) {
        console.error("Send OTP failed:", error.message);
        res.status(500).json({
            message: "Internal server error. Could not send OTP.",
            error: error.message
        });
    }
};

// 2. Verify OTP
export const verifyOtpForReset = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Please provide email and OTP." });
        }

        const founduser = await user.findOne({ email });
        if (!founduser || !founduser.resetOtp || !founduser.resetOtpExpires) {
            return res.status(400).json({ message: "OTP not requested or expired." });
        }

        if (founduser.resetOtp !== otp) {
            return res.status(400).json({ message: "Invalid OTP." });
        }

        if (founduser.resetOtpExpires < new Date()) {
            return res.status(400).json({ message: "OTP expired." });
        }

        res.status(200).json({ message: "OTP verified. You can now reset your password." });

    } catch (error) {

        console.error("Verify OTP failed:", error.message);

        res.status(500).json({
            message: "Internal server error. Could not verify OTP.",
            error: error.message
        });
    }
};

// 3. Reset password with OTP
export const resetPasswordWithOtp = async (req, res) => {
    try {

        const { email, otp, newPassword, confirmPassword } = req.body;

        if (!email || !otp || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: "Please provide all required information." });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match." });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: "Password must contain at least 8 letters." });
        }

        const founduser = await user.findOne({ email });

        if (!founduser || !founduser.resetOtp || !founduser.resetOtpExpires) {
            return res.status(400).json({ message: "OTP not requested or expired." });
        }

        if (founduser.resetOtp !== otp) {
            return res.status(400).json({ message: "Invalid OTP." });
        }

        if (founduser.resetOtpExpires < new Date()) {
            return res.status(400).json({ message: "OTP expired." });
        }


        const hashedPassword = await bcrypt.hash(newPassword, 10);
        founduser.password = hashedPassword;
        founduser.resetOtp = undefined;
        founduser.resetOtpExpires = undefined;

        await founduser.save();

        res.status(200).json({ message: "Password reset successful." });

    } catch (error) {
        console.error("Reset password failed:", error.message);
        res.status(500).json({
            message: "Internal server error. Could not reset password.",
            error: error.message
        });
    }
};

const transporter = nodemailer.createTransport({
    service: 'Gmail', // or use SMTP settings
    auth: {
        user: process.env.ADMIN_EMAIL, // your admin email
        pass: process.env.ADMIN_EMAIL_PASSWORD // your email password or app password
    }
});

