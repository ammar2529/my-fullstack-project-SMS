import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/auth.model';
import { DatesheetModel } from '../../models/datesheet.model';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class DatesheetService {
  private apiUrl = environment.baseUrl;
  // constructor(private http: HttpClient) {}
  //
  // getAll(): Observable<ApiResponse<DatesheetModel[]>> {
  //   return this.http.get<ApiResponse<DatesheetModel[]>>(`${this.apiUrl}/Datesheet`);
  // }
  // getByClass(classId: number): Observable<ApiResponse<DatesheetModel[]>> {
  //   return this.http.get<ApiResponse<DatesheetModel[]>>(
  //     `${this.apiUrl}/Datesheet/byclass/${classId}`,
  //   );
  // }
  // create(dto: any): Observable<ApiResponse<any>> {
  //   return this.http.post<ApiResponse<any>>(`${this.apiUrl}/Datesheet`, dto);
  // }
  // update(id: number, dto: any): Observable<ApiResponse<any>> {
  //   return this.http.put<ApiResponse<any>>(`${this.apiUrl}/Datesheet/${id}`, dto);
  // }
  // delete(id: number): Observable<ApiResponse<any>> {
  //   return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/Datesheet/${id}`);
  // }

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/Datesheet`);
  }
  getByExamAndClass(examTitle: string, classId: number): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.apiUrl}/Datesheet/byexamtitle/${encodeURIComponent(examTitle)}/${classId}`,
    );
  }
  bulkSave(dto: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/Datesheet/bulk`, dto);
  }
  deleteByExam(examTitle: string, classId: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(
      `${this.apiUrl}/Datesheet/byexamtitle/${encodeURIComponent(examTitle)}/${classId}`,
    );
  }
}
