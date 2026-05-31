import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, ApiResponse } from '../models/auth.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private apiUrl = environment.baseUrl;
  private apiUrl = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(dto: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/Auth/login`, dto).pipe(
      tap((res) => {
        if (res.success) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('fullName', res.data.fullName);
          localStorage.setItem('role', res.data.role);
          localStorage.setItem('userId', res.data.userId.toString());
          localStorage.setItem('roleId', res.data.roleId.toString());
        }
      }),
    );
  }

  getRoleId(): number {
    return Number(localStorage.getItem('roleId') || 0);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getFullName(): string {
    return localStorage.getItem('fullName') || '';
  }

  getRole(): string {
    return localStorage.getItem('role') || '';
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  hasRole(roles: string[]): boolean {
    const currentRole = this.getRole();
    return roles.includes(currentRole);
  }

  isAdmin(): boolean {
    return this.getRole() === 'Admin';
  }

  isTeacher(): boolean {
    return this.getRole() === 'Teacher';
  }

  isStudent(): boolean {
    return this.getRole() === 'Student';
  }
}
