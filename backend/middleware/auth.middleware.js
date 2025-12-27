const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Blacklist = require('../models/Blacklist');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Check if token is blacklisted
            const blacklistedToken = await Blacklist.findOne({ token });
            if (blacklistedToken) {
                return res.status(401).json({
                    success: false,
                    error: 'Unauthorized',
                    message: 'Not authorized, token has been logged out'
                });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            return next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized',
                message: 'Not authorized, token failed'
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized',
            message: 'Not authorized, no token'
        });
    }
};

module.exports = { protect };
