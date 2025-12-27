const express = require('express');
const router = express.Router();
const {
    getTeams,
    getTeamById,
    createTeam,
    updateTeam,
    deleteTeam
} = require('../../controllers/maintenanceTeam.controller');
const { protect } = require('../../middleware/auth.middleware');
const validate = require('../../middleware/validate.middleware');
const { createTeamSchema, updateTeamSchema } = require('../../validations/maintenanceTeam.validation');

router.use(protect);

router.get('/', getTeams);
router.get('/:id', getTeamById);
router.post('/', validate(createTeamSchema), createTeam);
router.put('/:id', validate(updateTeamSchema), updateTeam);
router.delete('/:id', deleteTeam);

module.exports = router;
