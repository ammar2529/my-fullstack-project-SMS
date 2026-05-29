import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/auth.model';
import { SubjectModel } from '../../models/subject.model';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  private apiUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<SubjectModel[]>> {
    return this.http.get<ApiResponse<SubjectModel[]>>(`${this.apiUrl}/Subjects`);
  }
  create(dto: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/Subjects`, dto);
  }
  update(id: number, dto: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/Subjects/${id}`, dto);
  }
  delete(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/Subjects/${id}`);
  }
}
