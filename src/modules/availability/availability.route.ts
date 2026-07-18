import express from 'express'
import auth from '../../Middlewear/jwtAuth';
import { availabilityController } from './availability.controller';

const router = express.Router()

router.post('/', auth('TECHNICIAN'), availabilityController.createAvailability)
router.get('/', auth('TECHNICIAN'), availabilityController.getMyAvailability)
router.patch('/:id', auth('TECHNICIAN'), availabilityController.updateAvailability)
router.delete('/:id',auth('TECHNICIAN'),availabilityController.deleteAvailability)



export const availabilityRouter = router;