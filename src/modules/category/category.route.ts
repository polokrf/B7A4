import express from 'express'
import { categoryController } from './category.controller'
import auth from '../../Middlewear/jwtAuth'

const router = express.Router()

router.post('/', auth('ADMIN'), categoryController.createCategory)

router.get('/',auth(),categoryController.getAllCategory)

router.patch('/:id',auth('ADMIN'),categoryController.updateCategory)

router.delete('/:id',auth('ADMIN'),categoryController.deleteCategory)

export const categoryRouter = router
