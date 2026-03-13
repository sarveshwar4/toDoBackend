const express = require('express');
const User = require('../module/User');
const { validatSignUpData } = require('../utils/validation.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

const authRouter = express.Router();

authRouter.post("/signUpAsAdmin", async (req, res) => {
    try {

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: passwordHash,
            role: "admin"
        });

        const savedUser = await user.save();
        const token = jwt.sign(
            { _id: savedUser._id, role: savedUser.role },
            SECRET_KEY,
            { expiresIn: "1d" }
        );


        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        });

        res.status(201).json({
            message: "Admin created successfully",
            user: savedUser
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
});

authRouter.post("/signUp", async (req, res) => {
    try {
        validatSignUpData(req);

        const { name, email, password } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: passwordHash
        });

        const response = await user.save();

        const token = jwt.sign(
            { _id: response._id, role: response.role },
            SECRET_KEY,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        });
        res.status(200).json({
            message: "User signed up successfully",
            user: response
        });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


authRouter.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body;


        const user = await User.findOne({ email: email });

        if (!user) {
            throw new Error("Invalid credentials");
        }


        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }


        const token = jwt.sign(
            { _id: user._id },
            SECRET_KEY,
            { expiresIn: "1d" }
        );


        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        });

        res.status(200).json({
            message: "Login successful",
            user: user
        });

    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
});

module.exports = authRouter;