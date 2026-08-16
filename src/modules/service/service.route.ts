import express from 'express'
import auth from '../../Middlewear/jwtAuth'
import { serviceController } from './service.controller'
const router = express.Router()

router.post('/', auth('TECHNICIAN'), serviceController.creteService)

router.get('/', serviceController.getAllService)

router.get('/own-service',auth('TECHNICIAN'), serviceController.getOwnService)

router.get('/:id', auth(), serviceController.getSingleService)

router.patch('/:id',auth(),serviceController.updateService)
router.delete('/:id',auth(),serviceController.deleteService)

export const serviceRouter = router