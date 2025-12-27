const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
        'string.base': 'Name should be a type of text',
        'string.empty': 'Name cannot be an empty field',
        'string.min': 'Name should have a minimum length of {#limit}',
        'string.max': 'Name should have a maximum length of {#limit}',
        'any.required': 'Name is a required field'
    }),
    email: Joi.string().email().required().messages({
        'string.base': 'Email should be a type of text',
        'string.empty': 'Email cannot be an empty field',
        'string.email': 'Email must be a valid email',
        'any.required': 'Email is a required field'
    }),
    password: Joi.string().min(6).required().messages({
        'string.base': 'Password should be a type of text',
        'string.empty': 'Password cannot be an empty field',
        'string.min': 'Password should have a minimum length of {#limit}',
        'any.required': 'Password is a required field'
    }),
    role: Joi.string().valid('user', 'technician', 'manager', 'admin').optional(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.base': 'Email should be a type of text',
        'string.empty': 'Email cannot be an empty field',
        'string.email': 'Email must be a valid email',
        'any.required': 'Email is a required field'
    }),
    password: Joi.string().required().messages({
        'string.base': 'Password should be a type of text',
        'string.empty': 'Password cannot be an empty field',
        'any.required': 'Password is a required field'
    }),
});

module.exports = {
    registerSchema,
    loginSchema,
};
