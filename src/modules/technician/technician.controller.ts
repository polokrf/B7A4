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

export const technicianController = {
  createTechnicianProfile
}