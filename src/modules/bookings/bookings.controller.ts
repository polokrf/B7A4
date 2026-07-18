import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { bookingService } from "./bookings.service";
import { successRes } from "../../utils/clientResponse";

const createBooking = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const payload = req.body;
  const userId = req.user?.id!

  const result = await bookingService.createBookingDB(payload, userId)
  
  successRes(res, {
    success: true,
    status: 201,
    message: 'booking done successfully',
    data: result
  })
})

const getAllBooking = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const {id,role}= req?.user!
  
  const result = await bookingService.getAllBookingDB(id, role)
  
  successRes(res, {
    success: true,
    status: 200,
    message: 'booking  retrieve successfully',
    data: result,
  });
})
const getSingleBooking = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const id = req.params?.id
  const userId = req.user?.id!

  const result = await bookingService.getSingleBookingDB(id as string, userId)
  
  successRes(res, {
    success: true,
    status: 200,
    message: 'booking  retrieve successfully',
    data: result,
  });
})
const updateBooking = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const id = req.params.id!
  const userId = req.user?.id!
  const payload = req.body

  const result = await bookingService.updateBookingDB(id as string, payload, userId)
  
  successRes(res, {
    success: true,
    status: 200,
    message: 'booking  update successfully',
    data: result,
  });
})
const cancelBooking = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const id = req.params.id!
  const userId = req.user?.id!
  

  const result = await bookingService.cancelBookingDB(id as string,userId)
  
  successRes(res, {
    success: true,
    status: 200,
    message: 'Booking cancelled successfully',
    data: result,
  });
})

export const bookingController = {
  createBooking,
  getAllBooking,
  getSingleBooking,
  updateBooking,
  cancelBooking
}