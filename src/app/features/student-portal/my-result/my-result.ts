import { Component, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../shared/services/toast.service';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-my-result',
  imports: [],
  templateUrl: './my-result.html',
  styleUrl: './my-result.scss',
})
export class MyResult {
  results = signal<any[]>([]);
  loading = signal(false);

  constructor(
    private http: HttpClient,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.loadResults();
  }

  loadResults() {
    this.loading.set(true);
    this.http.get<any>(`${environment.baseUrl}/StudentPortal/results`).subscribe({
      next: (res) => {
        this.results.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  getGradeColor(grade: string): string {
    const colors: any = {
      'A+': '#27ae60',
      A: '#2ecc71',
      B: '#2980b9',
      C: '#f39c12',
      D: '#e67e22',
      F: '#e74c3c',
    };
    return colors[grade] || '#888';
  }
}
