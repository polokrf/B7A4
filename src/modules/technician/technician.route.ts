import express from 'express'
import auth from '../../Middlewear/jwtAuth';
import { technicianController } from './technician.controller';

const router = express.Router()

router.post('/profile',auth('TECHNICIAN'),technicianController.createTechnicianProfile);



export const technicianRouter = router