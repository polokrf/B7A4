import express from 'express'
import { paymentController } from './payment.controller'
import auth from '../../Middlewear/jwtAuth'
const router = express.Router()

router.post('/checkout-session', auth('CUSTOMER'), paymentController.createPayment)

router.patch(
  '/confirm',auth('CUSTOMER'),
paymentController.paymentConfirm
);

router.get(
  '/',
  auth('CUSTOMER'),
  paymentController.getAllPayments,
);
router.get(
  '/:id',
  auth('CUSTOMER'),
  paymentController.getSinglePayment,
);
export default router;

export const paymentRouter=router