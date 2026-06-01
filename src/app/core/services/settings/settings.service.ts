import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private apiUrl = environment.baseUrl;
  private _settings = new BehaviorSubject<any>(null);
  settings$ = this._settings.asObservable();

  constructor(private http: HttpClient) {}

  getSettings(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/Settings`).pipe(
      tap((res) => {
        if (res.success) this._settings.next(res.data);
      }),
    );
  }

  saveSettings(dto: any): Observable<ApiResponse<any>> {
    return this.http
      .post<ApiResponse<any>>(`${this.apiUrl}/Settings`, dto)
      .pipe(tap(() => this.getSettings().subscribe()));
  }

  getSchoolName(): string {
    return this._settings.value?.schoolName || 'School Management System';
  }
}
