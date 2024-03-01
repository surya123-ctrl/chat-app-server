const express = require('express');
const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const signup = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender, profilePicture } = req.body;
        if (password !== confirmPassword) return res.status(400).send({ message: 'Invalid password or confirmation' });
        const existingUser = await userModel.findOne({ username });
        if (existingUser) return res.status(400).send({ message: `username already exists` });
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const createdUser = await userModel.create({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePicture: gender === 'male' ? boyProfilePic : girlProfilePic
        })
        console.log(createdUser);
        if (createdUser) {
            generateToken(createdUser._id, res);
            await createdUser.save();
            res.status(201).send({ message: "User created successfully ", createdUser });
        }
        else {
            res.status(500).send({ message: "Unable to create User", error });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error", error })
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const foundUser = await userModel.findOne({ username: username });
        const isPasswordCorrect = await bcrypt.compare(password, foundUser?.password || "");
        if (!foundUser || !isPasswordCorrect) return res.status(400).send({ message: "Invalid username or password." });
        generateToken(foundUser._id, res);
        res.status(200).send({ message: "Logged In Successfully!" });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error", error })
    }
}

const logout = async (req, res) => {
    console.log("Logging Out");
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged Out Successfully" });
        console.log("Logged Out Successfully");
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error", error })
    }
}

module.exports = { signup, login, logout }