import { Student } from './student.model';
import { ClassModel as Class } from './class.model';
export interface FeeStructure {
  id?: number;
  classId: number;
  class?: Class;
  feeType: string;
  amount: number;
  isActive?: boolean;
}

export interface FeePayment {
  id?: number;
  studentId: number;
  student?: Student;
  feeStructureId: number;
  feeStructure?: FeeStructure;
  amountPaid: number;
  paymentDate?: string | Date;
  month: string;
  paymentMethod: string;
  remarks?: string;
  status?: string;
}
