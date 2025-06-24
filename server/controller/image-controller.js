import user from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

export const registercode = async (req, res) => {
    try {
        const { username, password, confirm_password, email } = req.body;

        if (!(username && password && confirm_password && email)) {
            res.status(400).send("Please enter all the information");
        }


        const existing_user2 = await user.findOne({ username });
        if (existing_user2) {
            res.status(400).send("username is unavailable");
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
        const USER = await user.create({
            username: username,
            password: hashed_password,
            email: email,
        });

        const token = jwt.sign({ id: USER._id, email: email }, process.env.SECRET_KEY, {
            expiresIn: '3hr',
        });

        USER.token = token;
        USER.password = undefined;
        res.status(200).json({ message: 'you have successfully registered', USER });
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
        const { identifier, password } = req.body;

        if (!(identifier && password)) {
            res.status(400).send("Please enter all the information");
        }

        const founduser = await user.findOne({
            $or: [{ username: identifier }, { email: identifier }]
        });


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
        founduser.token = token;
        res.status(200).json({ message: 'you have successfully logged in', founduser });

    } catch (error) {
        console.error("Login failed:", error.message);
        res.status(500).json({
            message: "Internal server error. login unsuccessful.",
            error: error.message
        });
    }

}

