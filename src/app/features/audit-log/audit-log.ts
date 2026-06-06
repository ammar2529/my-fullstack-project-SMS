import { Component, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-audit-log',
  imports: [DatePipe],
  templateUrl: './audit-log.html',
  styleUrl: './audit-log.scss',
})
export class AuditLog {
  logs = signal<any[]>([]);
  loading = signal(false);
  total = signal(0);
  page = signal(1);
  size = signal(50);
  filterAction = signal('');
  filterEntity = signal('');

  actions = ['Create', 'Update', 'Delete', 'Login'];
  entities = [
    'Student',
    'Teacher',
    'Class',
    'Subject',
    'Attendance',
    'Exam',
    'Fee',
    'Notice',
    'User',
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs() {
    this.loading.set(true);
    let url = `${environment.baseUrl}/AuditLog?page=${this.page()}&size=${this.size()}`;
    if (this.filterAction()) url += `&action=${this.filterAction()}`;
    if (this.filterEntity()) url += `&entity=${this.filterEntity()}`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        this.logs.set(res.data);
        this.total.set(res.total);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  getActionColor(action: string): string {
    const map: any = {
      Create: '#27ae60',
      Update: '#2980b9',
      Delete: '#e74c3c',
      Login: '#8e44ad',
    };
    return map[action] || '#888';
  }

  totalPages = () => Math.ceil(this.total() / this.size());

  prevPage() {
    if (this.page() > 1) {
      this.page.update((p) => p - 1);
      this.loadLogs();
    }
  }

  nextPage() {
    if (this.page() < this.totalPages()) {
      this.page.update((p) => p + 1);
      this.loadLogs();
    }
  }
}
