const MaintenanceStage = require('../models/MaintenanceStage');

const getStages = async (req, res) => {
    try {
        const stages = await MaintenanceStage.find().sort({ sequence: 1 });
        const formattedStages = stages.map(stage => ({
            id: stage._id.toString(),
            name: stage.name,
            sequence: stage.sequence,
            fold: stage.fold,
            isDone: stage.isDone,
            isScrap: stage.isScrap,
            createdAt: stage.createdAt,
            updatedAt: stage.updatedAt
        }));
        res.status(200).json({
            success: true,
            data: formattedStages
        });
    } catch (error) {
        console.error('Error in getStages:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message || 'Failed to fetch maintenance stages'
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
            data: {
                id: stage._id.toString(),
                name: stage.name,
                sequence: stage.sequence,
                fold: stage.fold,
                isDone: stage.isDone,
                isScrap: stage.isScrap,
                createdAt: stage.createdAt,
                updatedAt: stage.updatedAt
            }
        });
    } catch (error) {
        console.error('Error in getStageById:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message || 'Failed to fetch maintenance stage'
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
