import { Role } from "../../../generated/prisma/enums";


export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  address?: string;
  role: Role;
}

export interface ILogin{
  email: string
  password:string
}
