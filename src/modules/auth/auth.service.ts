import config from "../../config"
import { prisma } from "../../lib/prisma"
import { IRegisterUser } from "../../utils/interface"
import bcrypt  from "bcryptjs"

const UserRegisterDB = async (payload:IRegisterUser) => {
  const { name, email, password, address, phone, role } = payload

  const userExist = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (userExist) {
    throw new Error('user already exist')
  }

  const hasPassword = await bcrypt.hash(password,Number(config.bcrypt_salt_rounds))


  
  const result = await prisma.user.create({
    data: {
      name,
      email,
      password: hasPassword,
      address,
      phone,
      role,
    },
    omit: {
      password: true,
    }
  });

  return result
}


export const authService = {
  UserRegisterDB
}