import { NextFunction, Request, Response } from "express";


export const globalError = async (err:any, req:Request, res:Response, next:NextFunction) => {
  res.status(500).json({
    success: false,
    statusCode:500,
    name: err.name,
    message: err.message,
    error: err.stack,
  });
}