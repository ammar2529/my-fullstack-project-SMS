import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/auth.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class BaseApiService {
  private apiUrl = environment.baseUrl;
  constructor(protected http: HttpClient) {}

  getAll<T>(endpoint: string): Observable<ApiResponse<T[]>> {
    return this.http.get<ApiResponse<T[]>>(`${this.apiUrl}/${endpoint}`);
  }

  getById<T>(endpoint: string, id: number): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.apiUrl}/${endpoint}/${id}`);
  }

  create<T>(endpoint: string, body: T): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`, body);
  }

  update<T>(endpoint: string, id: number, body: T): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.apiUrl}/${endpoint}/${id}`, body);
  }

  delete<T>(endpoint: string, id: number): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(`${this.apiUrl}/${endpoint}/${id}`);
  }
}
