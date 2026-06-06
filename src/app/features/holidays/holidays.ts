import { Component, computed, signal } from '@angular/core';
import { FormField as FF, ReusableForm } from '../../shared/components/form/reusable-form/reusable-form';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';
import { environment } from '../../../environments/environment.development';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-holidays',
  imports: [DatePipe, ReusableForm],
  templateUrl: './holidays.html',
  styleUrl: './holidays.scss',
})
export class Holidays {
  holidays = signal<any[]>([]);
  loading = signal(false);
  formVisible = signal(false);
  formLoading = signal(false);
  editModel = signal<any>({});
  isEdit = signal(false);
  isAdmin = signal(false);
  filterType = signal('');

  filteredHolidays = computed(() => {
    if (!this.filterType()) return this.holidays();
    return this.holidays().filter((h) => h.holidayType === this.filterType());
  });

  formFields: FF[] = [
    { key: 'title', label: 'Holiday Title', type: 'text', required: true },
    {
      key: 'holidayType',
      label: 'Type',
      type: 'select',
      required: true,
      options: [
        { label: 'Public Holiday', value: 'Public' },
        { label: 'School Holiday', value: 'School' },
        { label: 'Exam Break', value: 'Exam' },
        { label: 'Summer Break', value: 'Summer' },
        { label: 'Winter Break', value: 'Winter' },
      ],
    },
    { key: 'startDate', label: 'Start Date', type: 'date', required: true },
    { key: 'endDate', label: 'End Date', type: 'date', required: true },
    { key: 'description', label: 'Description', type: 'textarea' },
  ];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.isAdmin.set(this.authService.getRole() === 'Admin');
    this.loadHolidays();
  }

  loadHolidays() {
    this.loading.set(true);
    this.http.get<any>(`${environment.baseUrl}/Holidays`).subscribe({
      next: (res) => {
        this.holidays.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openAdd() {
    this.isEdit.set(false);
    this.editModel.set({});
    this.formVisible.set(true);
  }

  openEdit(h: any) {
    this.isEdit.set(true);
    this.editModel.set({ ...h });
    this.formVisible.set(true);
  }

  onDelete(h: any) {
    if (confirm(`Delete "${h.title}"?`)) {
      this.http.delete<any>(`${environment.baseUrl}/Holidays/${h.id}`).subscribe({
        next: () => {
          this.loadHolidays();
          this.toast.success('Deleted!');
        },
        error: () => this.toast.error('Delete failed!'),
      });
    }
  }

  onSave(data: any) {
    this.formLoading.set(true);
    const call = this.isEdit()
      ? this.http.put<any>(`${environment.baseUrl}/Holidays/${data.id}`, data)
      : this.http.post<any>(`${environment.baseUrl}/Holidays`, data);
    call.subscribe({
      next: () => {
        this.formLoading.set(false);
        this.formVisible.set(false);
        this.loadHolidays();
        this.toast.success(this.isEdit() ? 'Updated!' : 'Holiday added!');
      },
      error: () => {
        this.formLoading.set(false);
        this.toast.error('Error!');
      },
    });
  }

  getDuration(start: string, end: string): number {
    const s = new Date(start);
    const e = new Date(end);
    return Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  getTypeColor(type: string): string {
    const colors: any = {
      Public: '#e74c3c',
      School: '#2980b9',
      Exam: '#8e44ad',
      Summer: '#f39c12',
      Winter: '#16a085',
    };
    return colors[type] || '#888';
  }

  isUpcoming(date: string): boolean {
    return new Date(date) > new Date();
  }
}
