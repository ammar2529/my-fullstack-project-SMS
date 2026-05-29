export interface TimetableModel {
  id: number;
  classId: number;
  className: string;
  subjectId: number;
  subjectName: string;
  teacherId: number;
  teacherName: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}
