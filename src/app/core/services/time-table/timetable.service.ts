import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/auth.model';
import { TimetableModel } from '../../models/timetable.model';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TimetableService {
  private apiUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<TimetableModel[]>> {
    return this.http.get<ApiResponse<TimetableModel[]>>(`${this.apiUrl}/Timetable`);
  }
  getByClass(classId: number): Observable<ApiResponse<TimetableModel[]>> {
    return this.http.get<ApiResponse<TimetableModel[]>>(
      `${this.apiUrl}/Timetable/byclass/${classId}`,
    );
  }
  create(dto: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/Timetable`, dto);
  }
  update(id: number, dto: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/Timetable/${id}`, dto);
  }
  delete(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/Timetable/${id}`);
  }
}
