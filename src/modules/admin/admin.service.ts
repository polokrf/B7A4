import { UserStatus } from '../../../generated/prisma/enums';
import { prisma } from '../../lib/prisma';
import { ICategory } from './category.interface';

const userBasicSelect = {
  id: true,
  name: true,
  email: true,
};

// 1. Get all users
const getAllUsersFromDB = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      address: true,
      role: true,
      status: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
      technicianProfile: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return users;
};

// 2. Update user status (ACTIVE / BANNED)
const updateUserStatusInDB = async (userId: string, status: string) => {
  if (!status) {
    throw new Error('Status field is required');
  }

  // Manual Enum check
  const validStatuses = Object.values(UserStatus);
  if (!validStatuses.includes(status as UserStatus)) {
    throw new Error(
      `Invalid status. Allowed values are: ${validStatuses.join(', ')}`,
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    const error: any = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      status: status as UserStatus,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      address: true,
      role: true,
      status: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

// 3. Get all bookings
const getAllBookingsFromDB = async () => {
  const bookings = await prisma.booking.findMany({
    include: {
      customer: {
        select: userBasicSelect,
      },
      technician: {
        select: userBasicSelect,
      },
      service: true,
      payment: true,
      review: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return bookings;
};





const createCategoryDB = async (payload:ICategory) => {
  const result = await prisma.category.create({
    data: {
      ...payload
    }

  })

  return result
}

const getAllCategoryDB = async () => {
  const result = await prisma.category.findMany()

  return result
}

const updateCategoryDB = async (id: string, payload: Partial<ICategory>) => {
  
  if (Object.keys(payload).length === 0) {
     throw new Error('No data provided');
  }
  
  const result = await prisma.category.update({
    where: {
      id:id
    },
    data: {
      ...payload
    }
  })

  return result
  
}
const deleteCategoryDB = async (id: string) => {
  const serviceExists = await prisma.service.findFirst({
    where: {
      categoryId: id,
    },
  });

  if (serviceExists) {
    throw new Error(
      'Cannot delete category because it has associated services.',
    );
  }
  
  await prisma.category.delete({
    where: {
     id:id
   }
 })
  
  
}

const getMetaDB = async () => {
   const [user, booking, service] = await Promise.all([
     prisma.user.count(),
     prisma.booking.count(),
     prisma.service.count(),
   ]);

  return {
    user,
    booking,
    service
  }
}

export const adminService = {
  getAllUsersFromDB,
  updateUserStatusInDB,
  getAllBookingsFromDB,
  getMetaDB,
  getAllCategoryDB,
  createCategoryDB,
  deleteCategoryDB,
  updateCategoryDB
};
