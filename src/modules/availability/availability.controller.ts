import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { availabilityService } from "./availability.service";
import { successRes } from "../../utils/clientResponse";

const createAvailability = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const id = req.user?.id!
  const payload = req.body

  const result = await availabilityService.createAvailabilityDB(payload, id)
  
  successRes(res, {
    success: true,
    status: 201,
    message: 'availability create successfully',
    data: result
  })
})
const getMyAvailability = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const id = req.user?.id!
  const result = await availabilityService.getMyAvailabilityDB(id)

  successRes(res, {
    success: true,
    status: 200,
    message: 'retrieve availability successfully',
    data: result,
  });
})
const updateAvailability = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  
  const userId = req.user?.id!
  const payload = req.body

  const result = await availabilityService.updateAvailabilityDB(payload,payload.id, userId)
  
  successRes(res, {
    success: true,
    status: 200,
    message: 'availability updated successfully',
    data: result,
  });
  
})
const deleteAvailability = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const id = req.params.id
  const userId = req.user?.id!

 const result =  await availabilityService.deleteAvailabilityDB(id as string, userId)
  
  successRes(res, {
    success: true,
    status: 200,
    message: 'availability delete successfully',
    data:{deletedId:result?.id}
  });
})

export const availabilityController = {
  createAvailability,
  getMyAvailability,
  updateAvailability,
  deleteAvailability
};