import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AttendanceModel } from '../../models/attendance.model';
import { ApiResponse } from '../../models/auth.model';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private apiUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/Attendance`);
  }
  getByClassAndDate(classId: number, date: string): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.apiUrl}/Attendance/byclass/${classId}/${date}`,
    );
  }
  getByTeacher(teacherId: number, date: string): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.apiUrl}/Attendance/byteacher/${teacherId}/${date}`,
    );
  }
  bulkSave(list: any[]): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/Attendance/bulk`, list);
  }
  delete(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/Attendance/${id}`);
  }
}
