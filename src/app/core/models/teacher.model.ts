export interface Teacher {
  id: number;
  employeeCode: string;
  fullName: string;
  email: string;
  qualification: string;
  joiningDate: string;
  salary: number;
  isActive: boolean;
}

export interface CreateTeacherDto {
  fullName: string;
  email: string;
  password?: string;
  employeeCode: string;
  qualification: string;
  joiningDate: string;
  salary: number;
}
