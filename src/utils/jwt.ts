import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'
import { successRes } from './clientResponse';
const createToken = (jwtPayload:JwtPayload,secret:string,expiresIn:SignOptions) => {
  const token = jwt.sign(jwtPayload, secret, expiresIn);

  return token
}

const verifyToken = (token:string, secret:string) => {
  try {
    const verifyUser = jwt.verify(token, secret);

    return {
      success: true,
      message: 'verify user successfully',
      data:verifyUser
    }
  } catch (error :any) {
    console.log(error.message)
    return {
      success: false,
      status: 403,
      error:error.message
    };
  }
}


export const jwtToken = {
  createToken,
  verifyToken
}