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

const getAllServiceDB = async () => {

  
  const service = await prisma.service.findMany()

  return service
};

const getSingleServiceDB = async (id: string) => {
  const singleService = await prisma.service.findUniqueOrThrow({
    where: {
      id
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

