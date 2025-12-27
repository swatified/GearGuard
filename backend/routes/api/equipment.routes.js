const express = require('express');
const router = express.Router();
const {
    getEquipment,
    getEquipmentById,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    getEquipmentRequests
} = require('../../controllers/equipment.controller');
const { protect } = require('../../middleware/auth.middleware');
const validate = require('../../middleware/validate.middleware');
const { createEquipmentSchema, updateEquipmentSchema } = require('../../validations/equipment.validation');

router.use(protect);

router.get('/', getEquipment);
router.get('/:id', getEquipmentById);
router.post('/', validate(createEquipmentSchema), createEquipment);
router.put('/:id', validate(updateEquipmentSchema), updateEquipment);
router.delete('/:id', deleteEquipment);
router.get('/:id/requests', getEquipmentRequests);

module.exports = router;
