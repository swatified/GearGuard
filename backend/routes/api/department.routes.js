const express = require('express');
const router = express.Router();
const { getDepartments, createDepartment } = require('../../controllers/department.controller');
const { protect } = require('../../middleware/auth.middleware');

router.use(protect);
router.get('/', getDepartments);
router.post('/', createDepartment);

module.exports = router;
