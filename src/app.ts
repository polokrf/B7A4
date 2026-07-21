import cookieParser from 'cookie-parser';
import express, { Request, Response } from 'express'
import cors from 'cors'
import { authRouter } from './modules/auth/auth.route';
import { globalError } from './Middlewear/globalError';
import { notFound } from './Middlewear/notfound';
import { technicianRouter } from './modules/technician/technician.route';

import { serviceRouter } from './modules/service/service.route';
import { availabilityRouter } from './modules/availability/availability.route';
import { bookingRouter } from './modules/bookings/bookings.route';
import { paymentRouter } from './modules/payment/payment.route';
import { reviewRouter } from './modules/reviwe/reviwe.route';
import { adminRouter } from './modules/admin/admin.route';
const app = express();


app.use(cors({
  origin: 'jkj',
  credentials:true
}))



app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


app.use('/api/auth', authRouter)
app.use('/api/technician', technicianRouter);

app.use('/api/services', serviceRouter);
app.use('/api/availability',availabilityRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/review', reviewRouter)

app.use('/api/admin', adminRouter)


app.get('/', (req:Request, res:Response) => {
  res.json({message:'sever is connect!'})
})

app.use(notFound)
app.use(globalError)

export default app