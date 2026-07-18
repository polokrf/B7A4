import { prisma } from "../../lib/prisma"
import { IAvailability } from "./availability.interface"

const createAvailabilityDB = async (payload:IAvailability,id:string) => {
  if (Object.keys(payload).length === 0) {
    throw new Error('insert body is missing')
  }

  const result = await prisma.availability.create({
    data: {
      technicianId:id,
      ...payload
      
    }
  })

  return result
}

const getMyAvailabilityDB = async (id:string) => {
  const result = await prisma.availability.findMany({
    where: {
      technicianId:id
    },
    orderBy: {
      day:'asc'
    }
  })

  return result
}

const updateAvailabilityDB = async (payload:Partial<IAvailability>,id:string,userId:string) => {
  if (Object.keys(payload).length === 0) {
    throw new Error('update body is missing')
  }

  const availabilityExits = await prisma.availability.findUniqueOrThrow({
    where: {
      id
    }
  })

  if (availabilityExits.technicianId !== userId) {
    throw new Error('forbidden access')
  }

  const result = await prisma.availability.update({
    where: {
      id
    },
    data: {
      ...payload
    }
  })

  return result


}

const deleteAvailabilityDB = async (id:string,userId:string) => {
  const availabilityExits = await prisma.availability.findUniqueOrThrow({
    where: {
      id
    }
  })

  if (availabilityExits.technicianId !== userId) {
     throw new Error('forbidden access');
  }

  return await prisma.availability.delete({
    where: {
      id
    }
  })
}


export const availabilityService = {
  createAvailabilityDB,
  getMyAvailabilityDB,
  updateAvailabilityDB,
  deleteAvailabilityDB
}