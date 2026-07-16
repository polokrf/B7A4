import { NextFunction, Request, Response } from "express"
import { Role } from "../../generated/prisma/enums"
import catchAsync from "../utils/catchAsync"
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from "../config"
import { jwtToken } from "../utils/jwt"
import { prisma } from "../lib/prisma"


declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: Role;
      };
    }
  }
}

const auth = (...role:Role[]) => {
  return catchAsync(async (req:Request, res:Response, next:NextFunction) => {
   
    const token = req.cookies?.accessToken
      ? req.cookies?.accessToken
      : req.headers.authorization?.startsWith('Bearer')
        ? req.headers.authorization?.split(' ')[1]
        : req.headers.authorization;
    
    if (!token) {
      throw new Error('unauthorized access')
    }

    const verifyToken = jwtToken.verifyToken(token, config.jwt_access_secret) as JwtPayload;
    
    if (verifyToken?.success === false) {
          throw new Error('forbidden access')
    }
    
    const userExist = await prisma.user.findUniqueOrThrow({
      where:{
        id: verifyToken.data?.id,
        email:verifyToken.data?.email
      }
    })

    if (userExist.status === 'BLOCKED') {
      throw new Error(
        'Your account is blocked. Please contact the support team',
      );
    }
    
    if (role.length && !role.includes(verifyToken?.data?.role)) {
        throw new Error('forbidden access');
    }

    req.user = {
      id: verifyToken.data?.id,
      name: verifyToken.data?.name,
      email: verifyToken.data?.email,
      role: verifyToken.data?.role,
    };


    next();  
  })
}


export default auth