import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { servicesService } from "./services.service";
import { successRes } from "../../utils/clientResponse";

const creteService = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const payload = req.body
  const {id}=req?.user!
  
  const result = await servicesService.createServiceDB(payload,id)

  successRes(res,{success:true,status:201,message:'create service successfully',data:result})

})
const getAllService = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const services = await servicesService.getAllServiceDB()
   successRes(res, {
     success: true,
     status: 200,
     message: 'retrieve service successfully',
     data: services,
   });
  
})
const getSingleService = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const { id } = req.params
  
  const singleService = await servicesService.getSingleServiceDB(id as string)

  successRes(res, {
    success: true,
    status: 200,
    message: 'retrieve service successfully',
    data: singleService,
  });
})
const updateService = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const { id } = req.params!
  const payload = req.body
  const userId=req.user?.id
  
  const result = await servicesService.updateServiceDB(payload, id as string,userId as string)
  
  successRes(res, {
    success: true,
    status: 200,
    message: 'update service successfully',
    data: result,
  });
})
const deleteService = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const id = req.params.id!
  const userId = req.user?.id!

  await servicesService.deleteServiceDB(id, userId)

  successRes(res, {
    success: true,
    status: 200,
    message: 'deleted service successfully',
  });
  
})
 
export const serviceController = {
  creteService,
  getAllService,
  getSingleService,
  updateService,
  deleteService
}