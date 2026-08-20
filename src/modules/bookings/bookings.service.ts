import { BookingStatus, Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma"
import { IBooking, IBookingUp } from "./booking.interface"

const createBookingDB = async (payload:IBooking,userId:string) => {
  const service = await prisma.service.findUniqueOrThrow({
    where: {
      id:payload.serviceId
    }
  })

  if (!service.isAvailable) {
    throw new Error('Service is not available');
  }

  if (service.technicianId === userId) {
    throw new Error('You cannot book your own service');
  }

  const existingBooking = await prisma.booking.findFirst({
    where: {
      technicianId: service.technicianId,
      bookingDate: new Date(payload.bookingDate),
      timeSlot: payload.timeSlot,
      status: {
        notIn: [BookingStatus.CANCELLED, BookingStatus.DECLINED],
      },
    },
  });

  if (existingBooking) {
    throw new Error('This time slot is already booked');
  }

  const result = await prisma.booking.create({
    data: {
      customerId: userId,
      serviceId: service.id,
      technicianId: service.technicianId,
      timeSlot: payload.timeSlot,
      bookingDate: new Date(payload.bookingDate),
      totalAmount: service.price,
    },
  });

  return result
}

const getAllBookingDB = async (userId: string, role:string) => {

  if (role === Role.CUSTOMER) {
    return prisma.booking.findMany({
      where: {
        customerId: userId,
        
      },
    });
    
  }

  return prisma.booking.findMany({
    where: {
      technicianId: userId,
    },
  });

 
}
const getSingleBookingDB = async (id:string,userId:string) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: {
      id: id,
    },
    include: {
      service: true,
      payment: true,
      review: true,
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      technician: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  
  if (
    booking.customerId !== userId &&
    booking.technicianId !== userId
  ) {
    throw new Error('forbidden access');
  }

  return booking

  
}


const updateBookingDB = async (id: string, payload: IBookingUp,userId:string) => {
  
  if (Object.keys(payload).length === 0) {
    throw new Error('body missing')
  }
  const getBooking = await prisma.booking.findUniqueOrThrow({
    where: {
    id
  }
  })
  
  if (getBooking.technicianId !== userId) {
    throw new Error('forbidden access')
  }

  const allowedStatus:BookingStatus[] = [
    BookingStatus.ACCEPTED,
    BookingStatus.DECLINED,
    BookingStatus.IN_PROGRESS,
    BookingStatus.COMPLETED,
  ];

  if (!allowedStatus.includes(payload.status)) {
    throw new Error('Invalid booking status');
  }

  const currentStatus = getBooking.status;
  const newStatus = payload.status;

  switch (currentStatus) {
    case BookingStatus.REQUESTED:
      if (
        newStatus !== BookingStatus.ACCEPTED &&
        newStatus !== BookingStatus.DECLINED
      ) {
        throw new Error('Invalid status transition');
      }
      break;

    case BookingStatus.ACCEPTED:
      if (newStatus !== BookingStatus.IN_PROGRESS) {
        throw new Error('Invalid status transition');
      }
      break;

    case BookingStatus.IN_PROGRESS:
      if (newStatus !== BookingStatus.COMPLETED) {
        throw new Error('Invalid status transition');
      }
      break;
  }
 
  
  return await prisma.booking.update({
    where: {
      id
    },
    data: {
      status:payload?.status as BookingStatus
     }
    
  })  
  
}
const cancelBookingDB = async (id:string,userId:string) => {
  
  
  const getBooking = await prisma.booking.findUniqueOrThrow({
    where: {
    id
  }
  })

  if (
    getBooking.status === BookingStatus.IN_PROGRESS ||
    getBooking.status === BookingStatus.COMPLETED ||
    getBooking.status === BookingStatus.DECLINED ||
    getBooking.status === BookingStatus.CANCELLED
  ) {
    throw new Error('Booking cannot be cancelled');
  }
  
  if (getBooking.customerId !== userId) {
    throw new Error('forbidden access')
  }

 return await prisma.booking.update({
    where: {
      id
    },
    data: {
      status: BookingStatus.CANCELLED
     }
    
  })  
  
}


export const bookingService = {
  createBookingDB,
  getAllBookingDB,
  getSingleBookingDB,
  updateBookingDB,
  cancelBookingDB
}