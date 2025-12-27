const express = require('express');
const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'GearGuard API'
  });
});

// API routes will be mounted here
// router.use('/auth', require('./api/auth.routes'));
// router.use('/users', require('./api/user.routes'));
// router.use('/equipment', require('./api/equipment.routes'));
// router.use('/maintenance-teams', require('./api/maintenanceTeam.routes'));
// router.use('/maintenance-requests', require('./api/maintenanceRequest.routes'));
// router.use('/maintenance-stages', require('./api/maintenanceStage.routes'));
// router.use('/dashboard', require('./api/dashboard.routes'));

module.exports = router;

