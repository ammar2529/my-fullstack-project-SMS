export interface Student {
  id: number;
  rollNo: string;
  fullName: string;
  email: string;
  className: string;
  section: string;
  fatherName: string;
  phoneNo: string;
  address: string;
  dob: string;
  admissionDate: string;
  isActive: boolean;
  profilePicture?: string;
}

export interface CreateStudentDto {
  fullName: string;
  email: string;
  password?: string;
  rollNo: string;
  classId: number;
  fatherName: string;
  phoneNo: string;
  address: string;
  dob: string;
  imageFile?: File | null;
}
export interface UpdateStudentDto {
  id: number;
  fullName: string;
  email: string;
  rollNo: string;
  classId: number;
  fatherName: string;
  phoneNo: string;
  address: string;
  dob: string;
  imageFile?: File | null; // ← Update ke waqt agar image change karni ho
}
