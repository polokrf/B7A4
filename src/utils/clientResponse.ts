import { Response } from "express";

export interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}
interface IResponse<T>{
  success: boolean,
  status:number,
  message: string,
  data?: T,
  meta?:IMeta
}


export const successRes = <T>(res: Response, data: IResponse<T>) => {
  res.status(data.status).json({
    success: data.success,
    status: data.status,
    message: data.message,
    data: data?.data,
  })
};