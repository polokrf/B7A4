import { WeekDay } from "../../../generated/prisma/enums";

export interface IAvailability {
  day: WeekDay;
  startTime:string;
  endTime: string;
}
