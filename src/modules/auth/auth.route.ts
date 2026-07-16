import express from 'express'
import { authController } from './auth.controller'
import auth from '../../Middlewear/jwtAuth';

const router = express.Router()

router.post('/register', authController.userRegister);

router.post('/login', authController.userLogin);

router.get('/me',auth('ADMIN','TECHNICIAN','CUSTOMER'),authController.getProfile)


export const authRouter = router