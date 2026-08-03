const userModel = require('../models/user.model'); 
const jwt = require('jsonwebtoken');
const emailService = require('../services/email.service');
async function registerUser(req, res) { 

    try {
        const { name, email, password } = req.body;

        
        const isExistingUser = await userModel.findOne({ email });
        if (isExistingUser) {
            return res.status(422).json({ 
                message: "User already exists",
                status: "Failed"
            });
        }

        
        const newUser = new userModel({ name, email, password }); 
        
        await newUser.save();
        
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '3d' });
        
        res.cookie('jwt_token', token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 });

        res.status(201).json({
            message: "User registered successfully",
            User: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email
            },  
            status: "Success",
            token: token
        });
        
        emailService.sendRegistrationEmail(newUser.email, newUser.name).catch(err => {
            console.error("Background email registration failed:", err.message);
        });
    } catch (err) {
        
        console.error(err); 
        res.status(500).json({
            message: "Internal server error",
            status: "Failed"
        });
    }   
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

       if (!email || !password) {
            return res.status(400).json({
                message: "Please provide both email and password",
                status: "Failed"
            });
        } 
        const user = await userModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
                status: "Failed"
            });
        }

        
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password",
                status: "Failed"
            });
        }

        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' });

        
        res.cookie('jwt_token', token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 });

        res.status(200).json({
            message: "User logged in successfully",
            User: {
                _id: user._id,
                name: user.name,
                email: user.email
            },
            status: "Success",
            token: token
        });
    } catch (err) {
        
        console.error(err);
        res.status(500).json({
            message: "Internal server error",
            status: "Failed"
        });
    }
}   

module.exports = { 
    registerUser ,
    loginUser
};
