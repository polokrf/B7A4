import config from "../../config"
import { prisma } from "../../lib/prisma"
import bcrypt  from "bcryptjs"
import { ILogin, IRegisterUser } from "./auth.interface"
import jwt, { SignOptions } from 'jsonwebtoken'
import { jwtToken } from "../../utils/jwt"

const userRegisterDB = async (payload:IRegisterUser) => {
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


const userLoginDB = async (payload:ILogin) => {
  const { email, password } = payload;

  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: {
      email
    }
  })

  const comPassword = await bcrypt.compare(password, isUserExist.password)
  
  if (!comPassword) {
    throw new Error(`Invalid credentials. If you don't have an account, please register first and then log in.`)
  }

  const jwtPayload = {
    id:isUserExist.id,
    name: isUserExist.name,
    email: isUserExist.email,
    status: isUserExist.status,
    role:isUserExist.role
  }

  const accessToken = jwtToken.createToken(jwtPayload, config.jwt_access_secret, { expiresIn: config.jwt_access_expires } as SignOptions)
  
  
  return {accessToken}
}


const getProfileDB = async (id:string,role:boolean) => {
  const profile = await prisma.user.findUniqueOrThrow({
    where: {
      id:id
    },
    ...(role && {
      include: {
        technicianProfile:true
      }
    })
  })

  return profile
}

export const authService = {
  userRegisterDB,
  userLoginDB,
  getProfileDB
}