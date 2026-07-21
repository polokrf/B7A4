import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { technicianService } from "./technician.service";
import { successRes } from "../../utils/clientResponse";

const createTechnicianProfile = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const body = req.body
  const {id}=req?.user!
  const result = await technicianService.createTechnicianProDB(body,id)

  successRes(res,{success:true,status:201,message:'create technician profile successfully',data:result})
})

const getTechnicianProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await technicianService.getTechnicianProDB(req.query);

    successRes(res, {
      success: true,
      status: 200,
      message: 'Technician profiles fetched successfully',

      data: result.data,
      meta: result.meta,
    });
  },
);
const getSingleTechnicianProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  
  const id =req.params.id
  
  const result = await technicianService.getSingleTechnicianProDB(id as string)

  successRes(res, {
    success: true,
    status: 200,
    message: 'retrieve technician profile successfully',
    data: result
  })
})

export const technicianController = {
  createTechnicianProfile,
  getTechnicianProfile,
  getSingleTechnicianProfile
}