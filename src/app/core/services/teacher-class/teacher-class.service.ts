import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/auth.model';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TeacherClassService {
  private apiUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getByTeacher(teacherId: number): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.apiUrl}/TeacherClasses/byteacher/${teacherId}`,
    );
  }

  assign(teacherId: number, classId: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/TeacherClasses`, {
      teacherId,
      classId,
    });
  }

  remove(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/TeacherClasses/${id}`);
  }
}
