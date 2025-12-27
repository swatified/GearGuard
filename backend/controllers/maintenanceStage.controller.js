const MaintenanceStage = require('../models/MaintenanceStage');

const getStages = async (req, res) => {
    try {
        const stages = await MaintenanceStage.find().sort({ sequence: 1 });
        res.status(200).json({
            success: true,
            data: stages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message
        });
    }
};

const getStageById = async (req, res) => {
    try {
        const stage = await MaintenanceStage.findById(req.params.id);
        if (!stage) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Stage not found'
            });
        }
        res.status(200).json({
            success: true,
            data: stage
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message
        });
    }
};

const createStage = async (req, res) => {
    try {
        const stage = await MaintenanceStage.create(req.body);
        res.status(201).json({
            success: true,
            data: stage
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
    getStages,
    getStageById,
    createStage
};
