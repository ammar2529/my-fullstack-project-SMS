import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../models/auth.model';
import { Observable } from 'rxjs';
import { StudentTransportModel, TransportModel } from '../../models/transport.model';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TransportService {
  private apiUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<TransportModel[]>> {
    return this.http.get<ApiResponse<TransportModel[]>>(`${this.apiUrl}/Transport`);
  }
  create(dto: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/Transport`, dto);
  }
  update(id: number, dto: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/Transport/${id}`, dto);
  }
  delete(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/Transport/${id}`);
  }

  getStudentTransports(): Observable<ApiResponse<StudentTransportModel[]>> {
    return this.http.get<ApiResponse<StudentTransportModel[]>>(`${this.apiUrl}/Transport/students`);
  }
  assignStudent(dto: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/Transport/students`, dto);
  }
  removeStudent(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/Transport/students/${id}`);
  }
}
