import cookieParser from 'cookie-parser';
import express from 'express'
import cors from 'cors'
import { authRouter } from './modules/auth/auth.route';
import { globalError } from './Middlewear/globalError';
import { notFound } from './Middlewear/notfound';
import { technicianRouter } from './modules/technician/technician.route';
import { categoryRouter } from './modules/category/category.route';
import { serviceRouter } from './modules/service/service.route';
import { availabilityRouter } from './modules/availability/availability.route';
import { bookingRouter } from './modules/bookings/bookings.route';
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
app.use('/api/categories', categoryRouter);
app.use('/api/services', serviceRouter);
app.use('/api/availability',availabilityRouter);
app.use('/api/bookings', bookingRouter);


app.use(notFound)
app.use(globalError)

export default app