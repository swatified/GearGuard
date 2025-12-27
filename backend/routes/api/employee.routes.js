const express = require('express');
const router = express.Router();
const { getEmployees, createEmployee } = require('../../controllers/employee.controller');
const { protect } = require('../../middleware/auth.middleware');

router.use(protect);
router.get('/', getEmployees);
router.post('/', createEmployee);

module.exports = router;
