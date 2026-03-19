const express = require('express');
const { validatSignUpData } = require('../utils/validation.js');
const dotenv = require('dotenv');
const { userAuth } = require('../utils/userAuth.js');
const { loginUser, registerAdmin, loginAdmin, registerUser } = require('../service/authService.js');

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

const authRouter = express.Router();

authRouter.post("/signUpAsAdmin", async (req, res) => {
    try {

        const { name, email, password } = req.body;

        const { user, token } = await registerAdmin(name, email, password);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict"
        });

        res.status(201).json({
            message: "Admin created successfully",
            user: {
                _id: user._id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});


authRouter.post("/admin/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    const { user, token } = await loginAdmin(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict"
    });

    res.status(200).json({
      message: "Admin login successful",
      user: {
        _id: user._id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    res.status(400).json({
      error: error.message
    });

  }
});
authRouter.post("/signUp", async (req, res) => {
    try {

        validatSignUpData(req);

        const { name, email, password } = req.body;

        const { user, token } = await registerUser(name, email, password);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict"
        });

        res.status(201).json({
            message: "User signed up successfully",
            user: {
                _id: user._id,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const { user, token } = await loginUser(email, password);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        });

        res.status(200).json({
            message: "Login successful",
            user
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