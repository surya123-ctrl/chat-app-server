const express = require('express');
const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const signup = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender, profilePicture } = req.body;
        if (password !== confirmPassword) return res.status(400).send({ message: 'Invalid password or confirmation' });
        const existingUser = await userModel.findOne({ username });
        if (existingUser) return res.status(404).send({ message: `Username already exists` });
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).send({
                message: "Password must be at least 8 characters long and contain at least one capital letter, one number, and one special character."
            });
        }
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
        // console.log(createdUser);
        if (createdUser) {
            const token = generateToken(createdUser._id, res);
            await createdUser.save();
            res.status(201).json({ message: "User created successfully ", _id: createdUser._id, fullName: createdUser.fullName, username: createdUser.username, profilePicture: createdUser.profilePicture, token: token });
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
        const token = generateToken(foundUser._id, res);
        // console.log("token : ", token);
        res.status(200).json({ message: `Welcome ${foundUser.fullName}`, _id: foundUser._id, fullName: foundUser.fullName, username: foundUser.username, profilePicture: foundUser.profilePicture, token: token });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", error })
    }
}

const logout = async (req, res) => {
    console.log("Logging Out");
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged Out Successfully" });
        // console.log("Logged Out Successfully");
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error", error })
    }
}

module.exports = { signup, login, logout }