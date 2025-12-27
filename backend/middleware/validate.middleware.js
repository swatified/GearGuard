const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const messages = error.details.map((detail) => detail.message);
        return res.status(400).json({
            success: false,
            error: 'Validation Error',
            message: messages[0], // Return the first error message to match doc structure example
            details: messages // Keep full details if needed by advanced frontend handling
        });
    }

    next();
};

module.exports = validate;
