const EquipmentCategory = require('../models/EquipmentCategory');

const getCategories = async (req, res) => {
    try {
        const categories = await EquipmentCategory.find()
            .populate('responsible', 'name email')
            .sort({ name: 1 });
        
        // Format the response to match frontend expectations
        const formattedCategories = categories.map(cat => {
            const catObj = cat.toObject();
            return {
                id: catObj._id.toString(),
                name: catObj.name,
                responsible: catObj.responsible ? {
                    id: catObj.responsible._id.toString(),
                    name: catObj.responsible.name,
                    email: catObj.responsible.email
                } : null,
                description: catObj.description || '',
                active: catObj.active,
                createdAt: catObj.createdAt,
                updatedAt: catObj.updatedAt
            };
        });
        
        res.status(200).json({ success: true, data: formattedCategories });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error', message: error.message });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const category = await EquipmentCategory.findById(req.params.id)
            .populate('responsible', 'name email');
        
        if (!category) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Category not found'
            });
        }
        
        const catObj = category.toObject();
        const formattedCategory = {
            id: catObj._id.toString(),
            name: catObj.name,
            responsible: catObj.responsible ? {
                id: catObj.responsible._id.toString(),
                name: catObj.responsible.name,
                email: catObj.responsible.email
            } : null,
            description: catObj.description || '',
            active: catObj.active,
            createdAt: catObj.createdAt,
            updatedAt: catObj.updatedAt
        };
        
        res.status(200).json({ success: true, data: formattedCategory });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error', message: error.message });
    }
};

const createCategory = async (req, res) => {
    try {
        const category = await EquipmentCategory.create(req.body);
        const populatedCategory = await EquipmentCategory.findById(category._id)
            .populate('responsible', 'name email');
        
        const catObj = populatedCategory.toObject();
        const formattedCategory = {
            id: catObj._id.toString(),
            name: catObj.name,
            responsible: catObj.responsible ? {
                id: catObj.responsible._id.toString(),
                name: catObj.responsible.name,
                email: catObj.responsible.email
            } : null,
            description: catObj.description || '',
            active: catObj.active,
            createdAt: catObj.createdAt,
            updatedAt: catObj.updatedAt
        };
        
        res.status(201).json({ success: true, data: formattedCategory });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error', message: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const category = await EquipmentCategory.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('responsible', 'name email');
        
        if (!category) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Category not found'
            });
        }
        
        const catObj = category.toObject();
        const formattedCategory = {
            id: catObj._id.toString(),
            name: catObj.name,
            responsible: catObj.responsible ? {
                id: catObj.responsible._id.toString(),
                name: catObj.responsible.name,
                email: catObj.responsible.email
            } : null,
            description: catObj.description || '',
            active: catObj.active,
            createdAt: catObj.createdAt,
            updatedAt: catObj.updatedAt
        };
        
        res.status(200).json({ success: true, data: formattedCategory });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error', message: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const category = await EquipmentCategory.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Category not found'
            });
        }
        
        // Soft delete by setting active to false
        category.active = false;
        await category.save();
        
        res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error', message: error.message });
    }
};

module.exports = { 
    getCategories, 
    getCategoryById,
    createCategory, 
    updateCategory,
    deleteCategory
};
