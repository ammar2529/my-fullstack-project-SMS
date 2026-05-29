import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/auth.model';
import { ClassModel } from '../../models/class.model';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  private apiUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<ClassModel[]>> {
    return this.http.get<ApiResponse<ClassModel[]>>(`${this.apiUrl}/Classes`);
  }
  create(dto: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/Classes`, dto);
  }
  update(id: number, dto: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/Classes/${id}`, dto);
  }
  delete(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/Classes/${id}`);
  }
}
