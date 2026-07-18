import express from 'express'
import auth from '../../Middlewear/jwtAuth'
import { bookingController } from './bookings.controller'
const router = express.Router()


router.post('/',auth(),bookingController.createBooking)
router.get('/',auth(),bookingController.getAllBooking)
router.get('/:id', auth(), bookingController.getSingleBooking)
router.patch('/:id', auth('TECHNICIAN'), bookingController.updateBooking)
router.patch('/:id/cancel',auth('CUSTOMER'),bookingController.cancelBooking)


export const bookingRouter = router