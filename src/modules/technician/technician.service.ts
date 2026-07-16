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


export const technicianService = {
  createTechnicianProDB
}