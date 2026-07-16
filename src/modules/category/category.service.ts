import { prisma } from "../../lib/prisma"
import { ICategory } from "./category.interface"

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



export const categoryService = {
  createCategoryDB,
  getAllCategoryDB,
  updateCategoryDB,
  deleteCategoryDB
}