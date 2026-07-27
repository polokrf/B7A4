import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { successRes } from "../../utils/clientResponse";
import { Role } from "../../../generated/prisma/enums";

const userRegister = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  const payload = req.body;
  const result = await authService.userRegisterDB(payload)
 
  successRes(res,{success:true,status:201,message:'Register user successfully',data:result})

})

const userLogin = catchAsync(async (req: Request, res: Response, next: NextFunction)=> {
  const payload = req.body

 const { accessToken} = await authService.userLoginDB(payload)
  
 res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 1,
  });
  
   successRes(res, {
     success: true,
     status: 200,
     message: 'Login user successfully',
     data:{accessToken},
   });
})


const getProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id, role } = req?.user!
  
  const userRole = role === 'TECHNICIAN'
  const profile = await authService.getProfileDB(id,userRole as boolean)
  successRes(res, {
    success: true,
    status: 200,
    message: 'get user profile successfully',
    data:profile ,
  });
})

export const authController = {
  userRegister,
  userLogin,
  getProfile
}