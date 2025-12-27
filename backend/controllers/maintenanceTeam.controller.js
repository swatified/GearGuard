const MaintenanceTeam = require('../models/MaintenanceTeam');
const User = require('../models/User');

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

        const formattedTeams = teams.map(team => ({
            id: team._id,
            name: team.name,
            memberIds: team.members.map(m => m._id),
            members: team.members,
            active: team.active,
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
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message
        });
    }
};

const getTeamById = async (req, res) => {
    try {
        const team = await MaintenanceTeam.findById(req.params.id)
            .populate('members', 'name email');

        if (!team) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Maintenance team not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                id: team._id,
                name: team.name,
                memberIds: team.members.map(m => m._id),
                members: team.members,
                requestCount: 0,
                active: team.active,
                createdAt: team.createdAt,
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

const createTeam = async (req, res) => {
    try {
        const { name, memberIds, active } = req.body;

        const team = await MaintenanceTeam.create({
            name,
            members: memberIds || [],
            active: active !== undefined ? active : true,
            createdBy: req.user.id
        });

        res.status(201).json({
            success: true,
            data: {
                id: team._id,
                name: team.name,
                memberIds: team.members,
                active: team.active,
                createdAt: team.createdAt
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
        );

        res.status(200).json({
            success: true,
            data: {
                id: team._id,
                name: team.name,
                memberIds: team.members,
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
