const Joi = require('joi');

const createEquipmentSchema = Joi.object({
    name: Joi.string().required(),
    serialNumber: Joi.string(),
    purchaseDate: Joi.date(),
    warrantyStartDate: Joi.date(),
    warrantyEndDate: Joi.date(),
    location: Joi.string(),
    departmentId: Joi.string().hex().length(24),
    categoryId: Joi.string().hex().length(24),
    employeeId: Joi.string().hex().length(24),
    maintenanceTeamId: Joi.string().hex().length(24).required(),
    technicianId: Joi.string().hex().length(24),
    note: Joi.string()
});

const updateEquipmentSchema = Joi.object({
    name: Joi.string(),
    serialNumber: Joi.string(),
    purchaseDate: Joi.date(),
    warrantyStartDate: Joi.date(),
    warrantyEndDate: Joi.date(),
    location: Joi.string(),
    departmentId: Joi.string().hex().length(24),
    categoryId: Joi.string().hex().length(24),
    employeeId: Joi.string().hex().length(24),
    maintenanceTeamId: Joi.string().hex().length(24),
    technicianId: Joi.string().hex().length(24),
    note: Joi.string(),
    active: Joi.boolean()
});

module.exports = {
    createEquipmentSchema,
    updateEquipmentSchema
};
