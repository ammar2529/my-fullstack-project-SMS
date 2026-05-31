export interface DatesheetModel {
  id: number;
  examTitle: string;
  classId: number;
  className: string;
  subjectId: number;
  subjectName: string;
  examDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  notes: string;
  isActive: boolean;
}
