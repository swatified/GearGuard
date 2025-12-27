const express = require('express');
const router = express.Router();
const { getUsers, getUserById, updateUser } = require('../../controllers/user.controller');
const { protect } = require('../../middleware/auth.middleware');
const validate = require('../../middleware/validate.middleware');
const { updateUserSchema } = require('../../validations/user.validation');

router.use(protect); // All routes are protected

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', validate(updateUserSchema), updateUser);

module.exports = router;
