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


        res.status(200).json({ message: 'you have successfully registered'});
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
            id: founduser._id, email: founduser.email
        }, process.env.SECRET_KEY,
            {
                expiresIn: "3hr"
            });
        founduser.password = undefined;
        res.status(200).json({ message: 'you have successfully logged in', token:token});

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
        if (!(email)) {
            res.status(400).send("Please enter required information");
        }

        const founduser = await user.findOne({email});


        if (!founduser) {
            res.status(400).send("user doesn't exist");
        }
        
        // Generate password reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
        founduser.passwordResetToken = resetToken;
        founduser.passwordResetExpiry = resetTokenExpiry;
        await founduser.save();

        // Create reset URL
        const resetUrl = `http://localhost:8000/reset-password/${resetToken}`;

        // Email content
        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: founduser.email,
            subject: 'Password Reset Request',
            html: `
                <h2>Password Reset Request</h2>
                <p>Hello ${founduser.username},</p>
                <p>You requested a password reset. Click the link below to reset your password:</p>
                <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; border-radius: 4px;">Reset Password</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
                <br>
                <p>Reset Token (for testing): ${resetToken}</p>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: 'Password reset email sent successfully',
            resetToken: resetToken // Only for testing - remove in production
        });
    } catch (error) {
        console.error("Forgot password failed:", error.message);
        res.status(500).json({
            message: "Internal server error. Could not send reset email.",
            error: error.message
        });
    }



}

export const resetpasswordcode = async (req, res) => {
    try {
        const { token } = req.params;
        const { password, confirm_password } = req.body;

        if (!(password && confirm_password)) {
            res.status(400).send("Please enter all the information");
        }
        if (password != confirm_password) {
            res.status(400).send("Password do not match");
        }

        if (password.length < 8) {
            res.status(400).send("Password must contain atleast 8 letters");
        }
        // Find user with valid reset token
        const founduser = await user.findOne({
            passwordResetToken: token,
            // passwordResetExpiry: { $gt: Date.now() } // Token not expired
        });

        if (!founduser) {
            return res.status(400).send("Invalid or expired reset token");
        }

        // Hash new password
        const hashed_password = await bcrypt.hash(password, 10);

        // Update user password and clear reset token
        founduser.password = hashed_password;
        founduser.passwordResetToken = undefined;
        founduser.passwordResetExpiry = undefined;
        await founduser.save();

        res.status(200).json({
            message: 'Password has been reset successfully. You can now login with your new password.'
        });

    } catch (error) {
        console.error("Password reset failed:", error.message);
        res.status(500).json({
            message: "Internal server error. Password reset unsuccessful.",
            error: error.message
        });
    }


}

const transporter = nodemailer.createTransport({
    service: 'Gmail', // or use SMTP settings
    auth: {
        user: process.env.ADMIN_EMAIL, // your admin email
        pass: process.env.ADMIN_EMAIL_PASSWORD // your email password or app password
    }
});

