const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, refreshToken, logoutUser } = require('../../controllers/auth.controller');
const { protect } = require('../../middleware/auth.middleware');
const validate = require('../../middleware/validate.middleware');
const { registerSchema, loginSchema } = require('../../validations/auth.validation');

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.get('/me', protect, getMe);
router.post('/refresh', protect, refreshToken);
router.post('/logout', protect, logoutUser);

module.exports = router;
