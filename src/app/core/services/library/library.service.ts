import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/auth.model';
import { BookIssueModel, BookModel } from '../../models/library.model';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class LibraryService {
  private apiUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}

  // Books
  getBooks(): Observable<ApiResponse<BookModel[]>> {
    return this.http.get<ApiResponse<BookModel[]>>(`${this.apiUrl}/Library/books`);
  }
  createBook(dto: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/Library/books`, dto);
  }
  updateBook(id: number, dto: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/Library/books/${id}`, dto);
  }
  deleteBook(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/Library/books/${id}`);
  }

  // Issues
  getIssues(): Observable<ApiResponse<BookIssueModel[]>> {
    return this.http.get<ApiResponse<BookIssueModel[]>>(`${this.apiUrl}/Library/issues`);
  }
  issueBook(dto: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/Library/issues`, dto);
  }
  returnBook(id: number): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/Library/issues/return/${id}`, {});
  }
  deleteIssue(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/Library/issues/${id}`);
  }
}
