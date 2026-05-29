import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/auth.model';
import { ExamModel } from '../../models/exam.model';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  private apiUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<ExamModel[]>> {
    return this.http.get<ApiResponse<ExamModel[]>>(`${this.apiUrl}/Exams`);
  }
  getByExamAndClass(examId: number, classId: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.apiUrl}/ExamResults/byexam/${examId}/${classId}`,
    );
  }
  getResultsList(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/ExamResults/list`);
  }
  getReportCard(studentId: number, examId: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.apiUrl}/ExamResults/reportcard/${studentId}/${examId}`,
    );
  }
  create(dto: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/Exams`, dto);
  }
  update(id: number, dto: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/Exams/${id}`, dto);
  }
  delete(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/Exams/${id}`);
  }
  bulkSaveResults(list: any[]): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/ExamResults/bulk`, list);
  }
}
