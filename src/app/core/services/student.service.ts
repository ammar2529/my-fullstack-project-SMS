import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/auth.model';
import { CreateStudentDto, Student, UpdateStudentDto } from '../models/student.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private apiUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<Student[]>> {
    return this.http.get<ApiResponse<Student[]>>(`${this.apiUrl}/Students`);
  }

  getById(id: number): Observable<ApiResponse<Student>> {
    return this.http.get<ApiResponse<Student>>(`${this.apiUrl}/Students/${id}`);
  }

  create(dto: CreateStudentDto): Observable<ApiResponse<any>> {
    const data = this.toFormData(dto);
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/Students`, data);
  }

  update(id: number, dto: UpdateStudentDto): Observable<ApiResponse<any>> {
    const data = this.toFormData(dto);
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/Students/${id}`, data);
  }

  delete(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/Students/${id}`);
  }

  getClasses(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/Classes`);
  }

  // Helper function: Normal Object ko FormData mein convert karne ke liye
  private toFormData(obj: any): FormData {
    const formData = new FormData();
    Object.keys(obj).forEach((key) => {
      if (obj[key] !== null && obj[key] !== undefined) {
        // Agar file hai ya normal text, dono ko append karega
        formData.append(key, obj[key]);
      }
    });
    return formData;
  }
}
