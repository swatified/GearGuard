const MaintenanceTeam = require('../models/MaintenanceTeam');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const User = require('../models/User');
const mongoose = require('mongoose');

const getTeams = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        let query = {};

        if (req.query.active !== undefined) {
            query.active = req.query.active === 'true';
        }

        if (req.query.search) {
            query.name = { $regex: req.query.search, $options: 'i' };
        }

        const total = await MaintenanceTeam.countDocuments(query);
        const teams = await MaintenanceTeam.find(query)
            .populate('members', 'name email')
            .skip(startIndex)
            .limit(limit)
            .sort({ createdAt: -1 });

        // Get request counts for each team
        const teamIds = teams.map(team => team._id);
        const requestCounts = await MaintenanceRequest.aggregate([
            {
                $match: {
                    maintenanceTeam: { $in: teamIds },
                    state: { $in: ['new', 'in_progress'] }
                }
            },
            {
                $group: {
                    _id: '$maintenanceTeam',
                    count: { $sum: 1 }
                }
            }
        ]);

        const requestCountMap = {};
        requestCounts.forEach(item => {
            requestCountMap[item._id.toString()] = item.count;
        });

        const formattedTeams = teams.map(team => ({
            id: team._id,
            name: team.name,
            memberIds: team.members.map(m => m._id),
            members: team.members.map(m => ({
                id: m._id,
                name: m.name,
                email: m.email
            })),
            active: team.active,
            requestCount: requestCountMap[team._id.toString()] || 0,
            createdAt: team.createdAt
        }));

        res.status(200).json({
            success: true,
            data: {
                teams: formattedTeams,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Error in getTeams:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message || 'Failed to fetch maintenance teams'
        });
    }
};

const getTeamById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid ID',
                message: 'Invalid team ID format'
            });
        }

        const team = await MaintenanceTeam.findById(req.params.id)
            .populate('members', 'name email');

        if (!team) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Maintenance team not found'
            });
        }

        const requestCount = await MaintenanceRequest.countDocuments({
            maintenanceTeam: team._id,
            state: { $in: ['new', 'in_progress'] }
        });

        res.status(200).json({
            success: true,
            data: {
                id: team._id.toString(),
                name: team.name,
                memberIds: team.members.map(m => m._id.toString()),
                members: team.members.map(m => ({
                    id: m._id.toString(),
                    name: m.name,
                    email: m.email
                })),
                requestCount: requestCount,
                active: team.active,
                createdAt: team.createdAt,
                updatedAt: team.updatedAt
            }
        });
    } catch (error) {
        console.error('Error in getTeamById:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message || 'Failed to fetch maintenance team details'
        });
    }
};

const createTeam = async (req, res) => {
    try {
        const { name, memberIds, active } = req.body;
        const team = await MaintenanceTeam.create({
            name,
            members: memberIds || [],
            active: active !== undefined ? active : true,
            createdBy: req.user.id
        });

        const populatedTeam = await MaintenanceTeam.findById(team._id).populate('members', 'name email');

        res.status(201).json({
            success: true,
            data: {
                id: populatedTeam._id,
                name: populatedTeam.name,
                members: populatedTeam.members,
                active: populatedTeam.active,
                createdAt: populatedTeam.createdAt
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

const updateTeam = async (req, res) => {
    try {
        let team = await MaintenanceTeam.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Maintenance team not found'
            });
        }

        const fieldsToUpdate = { ...req.body };
        if (fieldsToUpdate.memberIds) {
            fieldsToUpdate.members = fieldsToUpdate.memberIds;
            delete fieldsToUpdate.memberIds;
        }
        fieldsToUpdate.updatedBy = req.user.id;

        team = await MaintenanceTeam.findByIdAndUpdate(
            req.params.id,
            fieldsToUpdate,
            { new: true, runValidators: true }
        ).populate('members', 'name email');

        res.status(200).json({
            success: true,
            data: {
                id: team._id,
                name: team.name,
                members: team.members,
                active: team.active,
                updatedAt: team.updatedAt
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

const deleteTeam = async (req, res) => {
    try {
        const team = await MaintenanceTeam.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Maintenance team not found'
            });
        }

        team.active = false;
        await team.save();

        res.status(200).json({
            success: true,
            message: 'Team deleted successfully'
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
    getTeams,
    getTeamById,
    createTeam,
    updateTeam,
    deleteTeam
};
