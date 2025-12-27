const Joi = require('joi');

const createTeamSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Team name cannot be empty',
        'any.required': 'Team name is required'
    }),
    active: Joi.boolean(),
    memberIds: Joi.array().items(Joi.string().hex().length(24)).messages({
        'string.length': 'Invalid member ID format'
    })
});

const updateTeamSchema = Joi.object({
    name: Joi.string(),
    active: Joi.boolean(),
    memberIds: Joi.array().items(Joi.string().hex().length(24))
});

module.exports = {
    createTeamSchema,
    updateTeamSchema
};
