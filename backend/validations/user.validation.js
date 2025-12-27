const Joi = require('joi');

const updateUserSchema = Joi.object({
    name: Joi.string().min(2).max(50).messages({
        'string.base': 'Name should be a type of text',
        'string.min': 'Name should have a minimum length of {#limit}',
        'string.max': 'Name should have a maximum length of {#limit}'
    }),
    role: Joi.string().valid('user', 'technician', 'manager', 'admin').messages({
        'any.only': 'Role must be one of [user, technician, manager, admin]'
    }),
    password: Joi.string().min(6).messages({
        'string.min': 'Password should have a minimum length of {#limit}'
    }),
    // Prevent email updates via this endpoint for security, or add specific logic if needed
});

module.exports = {
    updateUserSchema
};
