const express = require('express');
const router = express.Router();
const { getActivityLogs } = require('../../controllers/activityLog.controller');
const { protect } = require('../../middleware/auth.middleware');

router.use(protect);
router.get('/:requestId', getActivityLogs);

module.exports = router;

