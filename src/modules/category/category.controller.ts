import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { categoryService } from "./category.service";
import { successRes } from "../../utils/clientResponse";



const createCategory = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const body = req.body
  const result = await categoryService.createCategoryDB(body) 

  successRes(res,{success:true,status:201,message:'category created successfully',data:result})
})


const getAllCategory = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const result = await categoryService.getAllCategoryDB()

  successRes(res, {
    success: true,
    status: 200,
    message: 'retrieve category successfully',
    data: result,
  });
})

const updateCategory = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const { id } = req.params
  const body = req.body
  
  const result = await categoryService.updateCategoryDB(id as string,body)

  successRes(res, {
    success: true,
    status: 200,
    message: ' updated category  successfully',
    data: result,
  });
})

const deleteCategory = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
 await categoryService.deleteCategoryDB(req.params.id as string)
  successRes(res, {
    success: true,
    status: 200,
    message: ' deleted category  successfully',
   
  });
})

export const categoryController = {
  createCategory,
  getAllCategory,
  updateCategory,
  deleteCategory
}