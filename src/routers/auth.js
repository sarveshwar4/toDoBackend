const express = require('express');
const User = require('../module/User');
const { validatSignUpData } = require('../utils/validation.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { userAuth } = require('../utils/userAuth.js');

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


authRouter.post("/admin/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }


    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Not an admin"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None"
    });

    res.status(200).json({
      message: "Admin login successful",
      user
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
});

authRouter.post("/signUp", async (req, res) => {
    try {
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

authRouter.get("/check", userAuth, async(req, res) => {
     try{
        const user = req.user;
        if(user){
            res.status(200).json({
                message: "User is authenticated",
                isLoggedIn: true
            });
        }

        else{
            res.status(200).json({
                message: "User is not authenticated",
                isLoggedIn: false
            });
        }
     }
     catch(error){
        res.status(400).json({
            error: error.message
        }); 
     }
});

authRouter.post("/logout", (req, res) =>{
    try{
    res.clearCookie("token", {
        httpOnly: true,
        secure: true, 
    });
    res.status(200).json({
        message: "Logout successful"
    });  
}
catch(error){
    res.status(400).json({
        error: error.message
    }); 
}
})

module.exports = authRouter;