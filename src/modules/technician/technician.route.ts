import express from 'express'
import auth from '../../Middlewear/jwtAuth';
import { technicianController } from './technician.controller';

const router = express.Router()

router.post('/profile',auth('TECHNICIAN'),technicianController.createTechnicianProfile);
router.get('/', technicianController.getTechnicianProfile)
router.get('/:id',auth(),technicianController.getSingleTechnicianProfile)


export const technicianRouter = router