import { Component, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-my-attendance',
  imports: [DatePipe],
  templateUrl: './my-attendance.html',
  styleUrl: './my-attendance.scss',
})
export class MyAttendance {
  data = signal<any>(null);
  loading = signal(false);
  month = signal(new Date().toISOString().slice(0, 7));

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadAttendance();
  }

  loadAttendance() {
    this.loading.set(true);
    this.http
      .get<any>(`${environment.baseUrl}/StudentPortal/attendance?month=${this.month()}`)
      .subscribe({
        next: (res) => {
          this.data.set(res.data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }
}
