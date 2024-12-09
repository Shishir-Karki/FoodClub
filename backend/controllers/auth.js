const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Signup Controller
exports.signup = async (req, res) => {
    try {
        const { username, email, password, phone } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ 
                message: "Please provide all required fields" 
            });
        }

        // Check if user exists
           // Check if user exists with either email or username
           const existingUser = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { username: username.toLowerCase() }
            ]
        });

        if (existingUser) {
            return res.status(400).json({ 
                message: existingUser.email === email.toLowerCase() ? 
                    "Email already registered" : 
                    "Username already taken"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            username,
            email: email.toLowerCase(),
            password: hashedPassword,
            phone
        });

        // Generate token
        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_TOKEN, // Move this to .env in production
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email
            },
            token
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            message: "Failed to create user",
            error: error.message
        });
    }
};

// Login Controller
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                message: "Please provide email and password" 
            });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ 
                message: "Invalid email or password" 
            });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ 
                message: "Invalid email or password" 
            });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id ,
                role: user.role
            },
            process.env.JWT_TOKEN, 
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
                email: user.email
            },
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};