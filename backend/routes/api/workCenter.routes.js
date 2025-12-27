const express = require('express');
const router = express.Router();
const {
    getWorkCenters,
    getWorkCenterById,
    createWorkCenter,
    updateWorkCenter,
    deleteWorkCenter
} = require('../../controllers/workCenter.controller');
const { protect } = require('../../middleware/auth.middleware');

router.use(protect);
router.get('/', getWorkCenters);
router.get('/:id', getWorkCenterById);
router.post('/', createWorkCenter);
router.put('/:id', updateWorkCenter);
router.delete('/:id', deleteWorkCenter);

module.exports = router;

