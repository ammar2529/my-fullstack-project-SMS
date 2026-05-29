import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/auth.model';
import { CreateStudentDto, Student } from '../models/student.model';
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
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/Students`, dto);
  }

  update(id: number, dto: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/Students/${id}`, dto);
  }

  delete(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/Students/${id}`);
  }

  getClasses(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/Classes`);
  }
}
