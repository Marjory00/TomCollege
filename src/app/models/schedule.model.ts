
// src/app/models/schedule.model.ts

import { Class } from './class.model';

export interface Schedule {
  _id: string;
  classId: Class | string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string;
  endTime: string;
  roomNumber: string;
  status: 'Active' | 'Cancelled' | 'Pending';
}
