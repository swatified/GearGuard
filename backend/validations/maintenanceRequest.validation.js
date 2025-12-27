const Joi = require('joi');

const createRequestSchema = Joi.object({
    subject: Joi.string().required(),
    description: Joi.string(),
    equipmentId: Joi.string().hex().length(24).required(),
    requestType: Joi.string().valid('corrective', 'preventive'),
    priority: Joi.string().valid('0', '1', '2', '3'),
    scheduledDate: Joi.date(),
    note: Joi.string()
});

const updateRequestSchema = Joi.object({
    subject: Joi.string(),
    description: Joi.string(),
    technicianId: Joi.string().hex().length(24),
    priority: Joi.string().valid('0', '1', '2', '3'),
    dateStart: Joi.date(),
    dateEnd: Joi.date(),
    duration: Joi.number(),
    maintenanceCost: Joi.number(),
    note: Joi.string()
});

const assignTechnicianSchema = Joi.object({
    technicianId: Joi.string().hex().length(24).required()
});

const completeRequestSchema = Joi.object({
    duration: Joi.number(),
    dateEnd: Joi.date(),
    maintenanceCost: Joi.number(),
    note: Joi.string()
});

const updateStageSchema = Joi.object({
    stageId: Joi.string().hex().length(24).required()
});

const scrapRequestSchema = Joi.object({
    scrapReason: Joi.string().required()
});

module.exports = {
    createRequestSchema,
    updateRequestSchema,
    assignTechnicianSchema,
    completeRequestSchema,
    updateStageSchema,
    scrapRequestSchema
};
