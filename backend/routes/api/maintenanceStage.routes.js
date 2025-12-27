const express = require('express');
const router = express.Router();
const { getStages, getStageById, createStage } = require('../../controllers/maintenanceStage.controller');
const { protect } = require('../../middleware/auth.middleware');

router.use(protect);

router.get('/', getStages);
router.get('/:id', getStageById);
router.post('/', createStage);

module.exports = router;
