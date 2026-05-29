export interface AttendanceModel {
  id: number;
  studentId: number;
  studentName: string;
  rollNo: string;
  classId: number;
  className: string;
  attendanceDate: string;
  status: string;
  isActive: boolean;
}
