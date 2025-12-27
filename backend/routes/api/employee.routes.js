const express = require('express');
const router = express.Router();
const { getEmployees, getEmployeeById, createEmployee } = require('../../controllers/employee.controller');
const { protect } = require('../../middleware/auth.middleware');

router.use(protect);
router.get('/', getEmployees);
router.get('/:id', getEmployeeById);
router.post('/', createEmployee);

module.exports = router;
