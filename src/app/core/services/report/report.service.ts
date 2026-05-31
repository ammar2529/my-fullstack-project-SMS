import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiResponse } from '../../models/auth.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private apiUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getStudentReport(classId?: number, search?: string): Observable<ApiResponse<any>> {
    let params = new HttpParams();
    if (classId) params = params.set('classId', classId);
    if (search) params = params.set('search', search);
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/Reports/students`, { params });
  }

  getAttendanceReport(
    classId?: number,
    fromDate?: string,
    toDate?: string,
  ): Observable<ApiResponse<any>> {
    let params = new HttpParams();
    if (classId) params = params.set('classId', classId);
    if (fromDate) params = params.set('fromDate', fromDate);
    if (toDate) params = params.set('toDate', toDate);
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/Reports/attendance`, { params });
  }

  getResultsReport(examId?: number, classId?: number): Observable<ApiResponse<any>> {
    let params = new HttpParams();
    if (examId) params = params.set('examId', examId);
    if (classId) params = params.set('classId', classId);
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/Reports/results`, { params });
  }
}
