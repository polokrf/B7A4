
import { prisma } from "../../lib/prisma";
import { ITechnician } from "./technician.interface";

const createTechnicianProDB = async (Payload:ITechnician,userId:string) => {
  const result = prisma.technicianProfile.create({
    data: {
      userId:userId,
      ...Payload
    }
  })

  return result
};
const getTechnicianProDB = async () => {
  const result = await prisma.user.findMany({
    where: {
      role: 'TECHNICIAN',
      status: 'ACTIVE',
      isDeleted:false
    },
    include: {
      technicianProfile:true
    }
  })

  return result
};
const getSingleTechnicianProDB = async (id:string) => {
  const result =await prisma.user.findUniqueOrThrow({
    where: {
      id:id
     
    },
    include: {
      technicianProfile: true,
      services:true,
      availability: true,
      technicianReviews:true
    }
  })

  if (
    result.role !== 'TECHNICIAN' ||
    result.status !== 'ACTIVE' ||
    result.isDeleted
  ) {
    throw new Error('Technician not found');
  }

  return result
};


export const technicianService = {
  createTechnicianProDB,
  getTechnicianProDB,
  getSingleTechnicianProDB
}