import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateTeacherDto, Teacher } from '../../models/teacher.model';
import { ApiResponse } from '../../models/auth.model';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private apiUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<Teacher[]>> {
    return this.http.get<ApiResponse<Teacher[]>>(`${this.apiUrl}/Teachers`);
  }

  create(dto: CreateTeacherDto): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/Teachers`, dto);
  }

  update(id: number, dto: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/Teachers/${id}`, dto);
  }

  delete(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/Teachers/${id}`);
  }
}
