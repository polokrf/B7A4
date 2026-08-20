import express from 'express';
import auth from '../../Middlewear/jwtAuth';
import { adminController } from './admin.controller';

const router = express.Router();



router.get('/users',auth('ADMIN'), adminController.getAllUsers);
router.patch('/users/:id', auth('ADMIN'),adminController.updateUserStatus);


router.get('/bookings',auth('ADMIN'), adminController.getAllBookings);

router.get('/categories', adminController.getAllCategory);
router.post('/categories',auth('ADMIN'), adminController.createCategory);
router.patch('/categories/:id',auth('ADMIN'), adminController.updateCategory);
router.delete('/categories/:id', auth('ADMIN'), adminController.deleteCategory);

router.get('/meta',adminController.getMeta)

export default router;
export const adminRouter = router;
