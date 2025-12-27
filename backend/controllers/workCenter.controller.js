const WorkCenter = require('../models/WorkCenter');
const mongoose = require('mongoose');

const getWorkCenters = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        let query = {};

        if (req.query.active !== undefined) {
            query.active = req.query.active === 'true';
        }

        if (req.query.search) {
            query.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { code: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const total = await WorkCenter.countDocuments(query);

        const workCenters = await WorkCenter.find(query)
            .populate('alternativeWorkcenters', 'name')
            .skip(startIndex)
            .limit(limit)
            .sort({ createdAt: -1 });

        // Format the response
        const formattedWorkCenters = workCenters.map(wc => {
            const wcObj = wc.toObject();
            return {
                id: wcObj._id.toString(),
                name: wcObj.name,
                code: wcObj.code || '',
                tag: wcObj.tag || '',
                alternativeWorkcenters: wcObj.alternativeWorkcenters?.map(aw => ({
                    id: aw._id.toString(),
                    name: aw.name
                })) || [],
                cost: wcObj.cost,
                rate: wcObj.rate,
                allocation: wcObj.allocation,
                costPerHour: wcObj.costPerHour,
                capacityTime: wcObj.capacityTime,
                capacityTimeEfficiency: wcObj.capacityTimeEfficiency,
                oeeTarget: wcObj.oeeTarget,
                active: wcObj.active,
                createdAt: wcObj.createdAt,
                updatedAt: wcObj.updatedAt
            };
        });

        res.status(200).json({
            success: true,
            data: {
                workCenters: formattedWorkCenters,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Error in getWorkCenters:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message || 'Failed to fetch work centers'
        });
    }
};

const getWorkCenterById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid ID',
                message: 'Invalid work center ID format'
            });
        }

        const workCenter = await WorkCenter.findById(req.params.id)
            .populate('alternativeWorkcenters', 'name');

        if (!workCenter) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Work center not found'
            });
        }

        const wcObj = workCenter.toObject();
        const formattedData = {
            id: wcObj._id.toString(),
            name: wcObj.name,
            code: wcObj.code || '',
            tag: wcObj.tag || '',
            alternativeWorkcenters: wcObj.alternativeWorkcenters?.map(aw => ({
                id: aw._id.toString(),
                name: aw.name
            })) || [],
            cost: wcObj.cost,
            rate: wcObj.rate,
            allocation: wcObj.allocation,
            costPerHour: wcObj.costPerHour,
            capacityTime: wcObj.capacityTime,
            capacityTimeEfficiency: wcObj.capacityTimeEfficiency,
            oeeTarget: wcObj.oeeTarget,
            active: wcObj.active,
            createdAt: wcObj.createdAt,
            updatedAt: wcObj.updatedAt
        };

        res.status(200).json({
            success: true,
            data: formattedData
        });
    } catch (error) {
        console.error('Error in getWorkCenterById:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message || 'Failed to fetch work center details'
        });
    }
};

const createWorkCenter = async (req, res) => {
    try {
        const workCenter = await WorkCenter.create({
            ...req.body,
            createdBy: req.user.id
        });

        const populatedWorkCenter = await WorkCenter.findById(workCenter._id)
            .populate('alternativeWorkcenters', 'name');

        const wcObj = populatedWorkCenter.toObject();
        const formattedData = {
            id: wcObj._id.toString(),
            name: wcObj.name,
            code: wcObj.code || '',
            tag: wcObj.tag || '',
            alternativeWorkcenters: wcObj.alternativeWorkcenters?.map(aw => ({
                id: aw._id.toString(),
                name: aw.name
            })) || [],
            cost: wcObj.cost,
            rate: wcObj.rate,
            allocation: wcObj.allocation,
            costPerHour: wcObj.costPerHour,
            capacityTime: wcObj.capacityTime,
            capacityTimeEfficiency: wcObj.capacityTimeEfficiency,
            oeeTarget: wcObj.oeeTarget,
            active: wcObj.active,
            createdAt: wcObj.createdAt,
            updatedAt: wcObj.updatedAt
        };

        res.status(201).json({
            success: true,
            data: formattedData
        });
    } catch (error) {
        console.error('Error in createWorkCenter:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message || 'Failed to create work center'
        });
    }
};

const updateWorkCenter = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid ID',
                message: 'Invalid work center ID format'
            });
        }

        let workCenter = await WorkCenter.findById(req.params.id);

        if (!workCenter) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Work center not found'
            });
        }

        workCenter = await WorkCenter.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedBy: req.user.id },
            { new: true, runValidators: true }
        ).populate('alternativeWorkcenters', 'name');

        const wcObj = workCenter.toObject();
        const formattedData = {
            id: wcObj._id.toString(),
            name: wcObj.name,
            code: wcObj.code || '',
            tag: wcObj.tag || '',
            alternativeWorkcenters: wcObj.alternativeWorkcenters?.map(aw => ({
                id: aw._id.toString(),
                name: aw.name
            })) || [],
            cost: wcObj.cost,
            rate: wcObj.rate,
            allocation: wcObj.allocation,
            costPerHour: wcObj.costPerHour,
            capacityTime: wcObj.capacityTime,
            capacityTimeEfficiency: wcObj.capacityTimeEfficiency,
            oeeTarget: wcObj.oeeTarget,
            active: wcObj.active,
            createdAt: wcObj.createdAt,
            updatedAt: wcObj.updatedAt
        };

        res.status(200).json({
            success: true,
            data: formattedData
        });
    } catch (error) {
        console.error('Error in updateWorkCenter:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message || 'Failed to update work center'
        });
    }
};

const deleteWorkCenter = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid ID',
                message: 'Invalid work center ID format'
            });
        }

        const workCenter = await WorkCenter.findById(req.params.id);

        if (!workCenter) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Work center not found'
            });
        }

        // Soft delete by setting active to false
        workCenter.active = false;
        await workCenter.save();

        res.status(200).json({
            success: true,
            message: 'Work center deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteWorkCenter:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message || 'Failed to delete work center'
        });
    }
};

module.exports = {
    getWorkCenters,
    getWorkCenterById,
    createWorkCenter,
    updateWorkCenter,
    deleteWorkCenter
};

