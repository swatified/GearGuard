const express = require('express');
const router = express.Router();
const {
    getRequests,
    getRequestById,
    createRequest,
    updateRequest,
    assignTechnician,
    updateStage,
    completeRequest,
    scrapRequest,
    getCalendarRequests,
    deleteRequest
} = require('../../controllers/maintenanceRequest.controller');
const { protect } = require('../../middleware/auth.middleware');
const validate = require('../../middleware/validate.middleware');
const {
    createRequestSchema,
    updateRequestSchema,
    assignTechnicianSchema,
    completeRequestSchema,
    updateStageSchema,
    scrapRequestSchema
} = require('../../validations/maintenanceRequest.validation');

router.use(protect);

router.get('/', getRequests);
router.get('/calendar', getCalendarRequests);
router.get('/:id', getRequestById);
router.post('/', validate(createRequestSchema), createRequest);
router.put('/:id', validate(updateRequestSchema), updateRequest);
router.patch('/:id/assign', validate(assignTechnicianSchema), assignTechnician);
router.patch('/:id/stage', validate(updateStageSchema), updateStage);
router.patch('/:id/complete', validate(completeRequestSchema), completeRequest);
router.patch('/:id/scrap', validate(scrapRequestSchema), scrapRequest);
router.delete('/:id', deleteRequest);

module.exports = router;
