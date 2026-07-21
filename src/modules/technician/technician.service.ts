
import { Prisma, Role, UserStatus } from "../../../generated/prisma/browser";
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

const getTechnicianProDB = async (query: Record<string, any>) => {
  const {
    searchTerm,
    location,
    minRating,
    minExperience,
    maxHourlyRate,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 10,
  } = query;

  const pageNum = Number(page) > 0 ? Number(page) : 1;
  const limitNum = Number(limit) > 0 ? Number(limit) : 10;
  const skip = (pageNum - 1) * limitNum;

 
  const andConditions: Prisma.UserWhereInput[] = [
    { role: Role.TECHNICIAN },
    { status: UserStatus.ACTIVE },
    { isDeleted: false },
  ];

  // Search in bio or skills
  if (searchTerm) {
    andConditions.push({
      technicianProfile: {
        OR: [
          { bio: { contains: String(searchTerm), mode: 'insensitive' } },
          { skills: { hasSome: [String(searchTerm)] } },
        ],
      },
    });
  }

  // Profile Filters
  if (location) {
    andConditions.push({
      technicianProfile: {
        location: { contains: String(location), mode: 'insensitive' },
      },
    });
  }

  if (minRating) {
    andConditions.push({
      technicianProfile: {
        averageRating: { gte: Number(minRating) },
      },
    });
  }

  if (minExperience) {
    andConditions.push({
      technicianProfile: {
        experience: { gte: Number(minExperience) },
      },
    });
  }

  if (maxHourlyRate) {
    andConditions.push({
      technicianProfile: {
        hourlyRate: { lte: Number(maxHourlyRate) },
      },
    });
  }

  const whereConditions: Prisma.UserWhereInput = { AND: andConditions };

  // Determine order by field location (User root or TechnicianProfile relation)
  let orderByCondition: Prisma.UserOrderByWithRelationInput = {};
  const profileFields = ['averageRating', 'hourlyRate', 'experience'];
  const direction = String(sortOrder).toLowerCase() === 'asc' ? 'asc' : 'desc';

  if (profileFields.includes(String(sortBy))) {
    orderByCondition = {
      technicianProfile: {
        [String(sortBy)]: direction,
      },
    };
  } else {
    orderByCondition = {
      [String(sortBy)]: direction,
    };
  }

  // Execute Count & Data queries in parallel
  const [total, data] = await Promise.all([
    prisma.user.count({ where: whereConditions }),
    prisma.user.findMany({
      where: whereConditions,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        address: true,
        role: true,
        status: true,
        createdAt: true,
        technicianProfile: true,
      },
      orderBy: orderByCondition,
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

const getSingleTechnicianProDB = async (id:string) => {
  const result =await prisma.user.findUniqueOrThrow({
    where: {
      id:id
     
    },
    omit:{password:true},
    include: {
      technicianProfile: true,
      services:true,
      availability: true,
      technicianReviews:true
    },
  
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