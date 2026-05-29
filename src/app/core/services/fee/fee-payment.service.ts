import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/auth.model';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class FeePaymentService {
  private apiUrl = `${environment.baseUrl}/FeePayments`; // Humne base route yahan set kar dia

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(this.apiUrl);
  }

  create(dto: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.apiUrl, dto);
  }

  getStudentHistory(studentId: number): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/student-history/${studentId}`);
  }

  // ==========================================
  // 🚀 BULK FEE EXTRA NEW ENDPOINTS
  // ==========================================

  /**
   * Class id aur Month ke mutabiq saare students ki fee status details sheet fetch karta hai
   */
  getBulkFeeStatus(classId: string, month: string): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.apiUrl}/bulk-collection?classId=${classId}&month=${month}`,
    );
  }

  /**
   * Poori modified sheet ko aik sath server par save/update karne ke liye
   */
  saveBulkFees(payload: any[]): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/bulk-save`, payload);
  }
}
