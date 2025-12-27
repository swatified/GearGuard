const express = require('express');
const router = express.Router();
const { getCategories, createCategory } = require('../../controllers/equipmentCategory.controller');
const { protect } = require('../../middleware/auth.middleware');

router.use(protect);
router.get('/', getCategories);
router.post('/', createCategory);

module.exports = router;
