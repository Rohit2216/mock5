const express = require("express");
require("dotenv").config()
const { userModel } = require("../models/usermodel");

const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

userRouter.post("/signup", async (req, res) => {
    const { email, password, confirmPassword } = req.body;
  
    // Check if password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Password and confirm password do not match' });
    }
  
    try {
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email is already registered' });
      }
  
      bcrypt.hash(password, 8, async (err, hashedPassword) => {
        if (err) {
          throw new Error(err.message);
        }
  
        const userData = new userModel({ email, password: hashedPassword });
        await userData.save();
  
        return res.status(200).json({ ok: true, msg: "User registered successfully!" });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ "msg":error.message });
    }
  });
  


userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ ok: false, msg: "User not found." });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(400).json({ ok: false, msg: "Invalid credentials" });
      }
  
      const token = jwt.sign({ userId: user._id }, process.env.userToken, { expiresIn: "2hr" });
      const response = {
        ok: true,
        token,
        msg: "Login successful",
      };
  
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ ok: false, msg: "Internal server error" });
    }
  });
  

module.exports = {
    userRouter
}