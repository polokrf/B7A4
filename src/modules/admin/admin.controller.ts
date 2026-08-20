import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { successRes } from '../../utils/clientResponse';
import { adminService } from './admin.service';


const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllUsersFromDB();

    successRes(res, {
      success: true,
      status: 200,
      message: 'Users retrieved successfully',
      data: result,
    });
  },
);

const updateUserStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;

    const result = await adminService.updateUserStatusInDB(id as string, status);

    successRes(res, {
      success: true,
      status: 200,
      message: 'User status updated successfully',
      data: result,
    });
  },
);

const getAllBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllBookingsFromDB();

    successRes(res, {
      success: true,
      status: 200,
      message: 'Bookings retrieved successfully',
      data: result,
    });
  },
);



const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const result = await adminService.createCategoryDB(body);

    successRes(res, {
      success: true,
      status: 201,
      message: 'category created successfully',
      data: result,
    });
  },
);

const getAllCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllCategoryDB();

    successRes(res, {
      success: true,
      status: 200,
      message: 'retrieve category successfully',
      data: result,
    });
  },
);

const updateCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const body = req.body;

    const result = await adminService.updateCategoryDB(id as string, body);

    successRes(res, {
      success: true,
      status: 200,
      message: ' updated category  successfully',
      data: result,
    });
  },
);

const deleteCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await adminService.deleteCategoryDB(req.params.id as string);
    successRes(res, {
      success: true,
      status: 200,
      message: ' deleted category  successfully',
    });
  },
);

const getMeta = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   const result = await adminService.getMetaDB();
   successRes(res, {
     success: true,
     status: 200,
     message: 'retrieve meta successfully',
     data: result,
   });
})



export const adminController = {
  getAllUsers,
  updateUserStatus,
  getAllBookings,
  getMeta,
 getAllCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
