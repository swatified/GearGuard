const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Blacklist = require('../models/Blacklist');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                success: false,
                error: 'Validation Error',
                message: 'Email already exists'
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'user'
        });

        if (user) {
            res.status(201).json({
                success: true,
                data: {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    },
                    token: generateToken(user.id),
                }
            });
        } else {
            res.status(400).json({
                success: false,
                error: 'Invalid Data',
                message: 'Invalid user data'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message
        });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Validation Error',
                message: 'Email and password are required'
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            console.error(`Login attempt failed: User not found for email: ${email}`);
            return res.status(401).json({
                success: false,
                error: 'Invalid Credentials',
                message: 'Email or password is incorrect'
            });
        }

        const isPasswordMatch = await user.matchPassword(password);
        
        if (!isPasswordMatch) {
            console.error(`Login attempt failed: Invalid password for email: ${email}`);
            return res.status(401).json({
                success: false,
                error: 'Invalid Credentials',
                message: 'Email or password is incorrect'
            });
        }

        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token: generateToken(user.id),
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message
        });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            maintenanceTeamIds: [] // Placeholder until teams are implemented
        };

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message
        });
    }
};

// @desc    Refresh user token
// @route   POST /api/auth/refresh
// @access  Private
const refreshToken = async (req, res) => {
    try {
        // User is already authenticated via middleware
        const token = generateToken(req.user._id);

        res.status(200).json({
            success: true,
            data: {
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message
        });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];

        // Add token to blacklist
        await Blacklist.create({ token });

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    refreshToken,
    logoutUser
};
