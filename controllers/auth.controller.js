const express = require('express');
const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const signup = async (req, res) => {
    try {
        // console.log(req.body);
        const { fullName, username, password, confirmPassword, gender, profilePicture } = req.body;
        if (password !== confirmPassword) return res.status(400).send({ message: 'Invalid password or confirmation' });
        const existingUser = await userModel.findOne({ username });
        // console.log("Existing User", existingUser);
        if (existingUser) return res.status(400).send({ message: `username already exists` });
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err;
            else {
                bcrypt.hash(password, salt, async (err, hashedPassword) => {
                    if (err) throw err;
                    else {
                        try {
                            const createdUser = await userModel.create({
                                fullName,
                                username,
                                password: hashedPassword,
                                gender,
                                profilePicture: gender === 'male' ? boyProfilePic : girlProfilePic
                            })
                            res.status(201).send({ message: "User created successfully ", createdUser });
                        }
                        catch (error) {
                            res.status(500).send({ message: "Unable to create User", error });
                        }
                    }
                })
            }
        })
    }
    catch (error) {
        console.log(error);
    }
}

const login = (req, res) => {
    console.log("Login User");
    res.send("Logged In");
}

module.exports = { login, signup }