import { Component, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardService } from '../../../core/services/dashboard/dashboard.service';
interface StatCard {
  title: string;
  value: string;
  icon: string;
  color: string;
  change: string;
}
@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  loading = signal(true);
  stats = signal<any>(null);
  fullName = signal('');
  role = signal('');

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.fullName.set(this.authService.getFullName());
    this.role.set(this.authService.getRole());
    this.loadStats();
  }

  loadStats() {
    this.loading.set(true);
    this.dashboardService.getStats().subscribe({
      next: (res) => {
        this.stats.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-PK', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  getBarHeight(percent: number): string {
    return Math.max(4, percent) + '%';
  }

  getBarColor(percent: number): string {
    if (percent >= 80) return '#27ae60';
    if (percent >= 60) return '#f39c12';
    return '#e74c3c';
  }

  getMaxStudents(): number {
    if (!this.stats()) return 1;
    const data = this.stats().studentsPerClass;
    return Math.max(...data.map((d: any) => d.count), 1);
  }
}
