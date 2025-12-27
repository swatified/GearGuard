const User = require('../models/User');


const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;


        let query = {};

        if (req.query.role) {
            query.role = req.query.role;
        }

        if (req.query.search) {
            query.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        // Filter by maintenance team (placeholder - needs relation implementation later)
        // if (req.query.teamId) { ... }

        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .select('-password')
            .skip(startIndex)
            .limit(limit)
            .sort({ createdAt: -1 });

        const pagination = {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        };

        res.status(200).json({
            success: true,
            data: {
                users,
                pagination
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

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                ...user.toObject(),
                maintenanceTeamIds: [] // Placeholder
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

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
const updateUser = async (req, res) => {
    try {
        let user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'User not found'
            });
        }

        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({
                success: false,
                error: 'Forbidden',
                message: 'Not authorized to update this user'
            });
        }

        const fieldsToUpdate = { ...req.body };


        if (req.user.role !== 'admin' && fieldsToUpdate.role) {
            delete fieldsToUpdate.role;
        }


        if (fieldsToUpdate.name) user.name = fieldsToUpdate.name;
        if (fieldsToUpdate.role && req.user.role === 'admin') user.role = fieldsToUpdate.role;
        if (fieldsToUpdate.password) user.password = fieldsToUpdate.password;

        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            data: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                updatedAt: updatedUser.updatedAt
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

module.exports = {
    getUsers,
    getUserById,
    updateUser
};
