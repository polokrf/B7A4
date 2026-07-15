import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { successRes } from "../../utils/clientResponse";

const userRegister = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  const payload = req.body;
  const result = await authService.UserRegisterDB(payload)
 
  successRes(res,{success:true,status:201,message:'Register user successfully',data:result})

})

export const authController = {
  userRegister
}