import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma"
import { IService } from "./service.interface"



const createServiceDB = async (payload: IService, userId: string) => {
  
  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!category) {
    throw new Error('Category not found');
  }
  const result = await prisma.service.create({
    data: {
      technicianId: userId,
      ...payload
   }
  })
  
  return result
}

const getAllServiceDB = async (query: Record<string, any>) => {
  const {
    searchTerm,
   location,
    minPrice,
    maxPrice,
    isAvailable,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 10,
  } = query;

  const pageNum = Number(page) > 0 ? Number(page) : 1;
  const limitNum = Number(limit) > 0 ? Number(limit) : 10;
  const skip = (pageNum - 1) * limitNum;

  // Dynamic Where Building
  const andConditions: Prisma.ServiceWhereInput[] = [];


  if (searchTerm) {
    andConditions.push({
      OR: [
        { title: { contains: String(searchTerm), mode: 'insensitive' } },
        { description: { contains: String(searchTerm), mode: 'insensitive' } },
      ],
    });
  }

 

  if (location) {
    andConditions.push({
      location: { contains: String(location), mode: 'insensitive' },
    });
  }

  if (isAvailable !== undefined) {
    andConditions.push({ isAvailable: String(isAvailable) === 'true' });
  }

  if (minPrice || maxPrice) {
    andConditions.push({
      price: {
        ...(minPrice ? { gte: Number(minPrice) } : {}),
        ...(maxPrice ? { lte: Number(maxPrice) } : {}),
      },
    });
  }

  const whereConditions: Prisma.ServiceWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  
  const [total, data] = await Promise.all([
    prisma.service.count({ where: whereConditions }),
    prisma.service.findMany({
      where: whereConditions,
     
      orderBy: {
        [String(sortBy)]:
          String(sortOrder).toLowerCase() === 'asc' ? 'asc' : 'desc',
      },
      skip,
      take: limitNum,
    }),
  ]);

  const totalPage = Math.ceil(total / limitNum);

  return {
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPage,
    },
    data,
  };
};

const getSingleServiceDB = async (id: string) => {
  const singleService = await prisma.service.findUniqueOrThrow({
      where: {
      id
    },
    include: {
      category: true,
      technician: {
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        address: true,
        technicianProfile: true,

       
      },
    },
    
  
  }
  })

  return singleService
  
}
const updateServiceDB = async (payload: Partial<IService>,id:string,userId:string) => {
  if (Object.keys(payload).length === 0) {
    throw new Error('update body is missing')
  }

  const service = await prisma.service.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (service.technicianId !== userId) {
    throw new Error('Unauthorized');
  }


  const result = await prisma.service.update({
    where: {
      id
    },
    data: {
      ...payload
    }
  })

  return result
  
}
const deleteServiceDB = async (id: string, userId: string) => {
  
  const service = await prisma.service.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (service.technicianId !== userId) {
    throw new Error('Unauthorized');
  }

  await prisma.service.delete({
    where: {
      id
    }
  })
}


export const servicesService = {
  createServiceDB,
  getAllServiceDB,
  getSingleServiceDB,
  updateServiceDB,
  deleteServiceDB
}

