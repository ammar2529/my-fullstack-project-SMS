import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';

export interface AppNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  time: Date;
  read: boolean;
  link?: string;
}
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private STORAGE_KEY = 'sms_read_notifs';

  notifications = signal<AppNotification[]>([]);
  unreadCount = computed(() => this.notifications().filter((n) => !n.read).length);

  constructor(private http: HttpClient) {}

  // LocalStorage se read IDs lo
  private getReadIds(): Set<string> {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  }

  // LocalStorage mein save karo
  private saveReadId(id: string) {
    const ids = this.getReadIds();
    ids.add(id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify([...ids]));
  }

  loadNotifications() {
    this.http.get<any>(`${environment.baseUrl}/Dashboard/stats`).subscribe({
      next: (res) => {
        const readIds = this.getReadIds();
        const notifs: AppNotification[] = [];
        const data = res.data;

        // Recent students
        if (data.recentStudents?.length > 0) {
          data.recentStudents.slice(0, 3).forEach((s: any, i: number) => {
            const id = `student_${s.id}`;
            notifs.push({
              id,
              type: 'success',
              title: 'New Student',
              message: `${s.fullName} added to ${s.className}`,
              time: new Date(s.createdAt),
              read: readIds.has(id),
              link: '/students',
            });
          });
        }

        // Recent notices
        if (data.recentNotices?.length > 0) {
          data.recentNotices.slice(0, 3).forEach((n: any) => {
            const id = `notice_${n.id}`;
            notifs.push({
              id,
              type: 'info',
              title: 'Notice Posted',
              message: n.title,
              time: new Date(n.noticeDate),
              read: readIds.has(id),
              link: '/notices',
            });
          });
        }

        // Recent teachers
        if (data.recentTeachers?.length > 0) {
          data.recentTeachers.slice(0, 2).forEach((t: any) => {
            const id = `teacher_${t.id}`;
            notifs.push({
              id,
              type: 'success',
              title: 'New Teacher',
              message: `${t.fullName} joined`,
              time: new Date(t.createdAt),
              read: readIds.has(id),
              link: '/teachers',
            });
          });
        }

        this.notifications.set(notifs.sort((a, b) => b.time.getTime() - a.time.getTime()));
      },
    });
  }

  markRead(id: string) {
    debugger
    this.saveReadId(id);
    this.notifications.update((n) => n.map((x) => (x.id === id ? { ...x, read: true } : x)));
  }

  markAllRead() {
    const ids = this.notifications().map((n) => n.id);
    ids.forEach((id) => this.saveReadId(id));
    this.notifications.update((n) => n.map((x) => ({ ...x, read: true })));
  }

  add(notif: Omit<AppNotification, 'id' | 'time' | 'read'>) {
    const id = `custom_${Date.now()}`;
    this.notifications.update((n) => [
      {
        ...notif,
        id,
        time: new Date(),
        read: false,
      },
      ...n,
    ]);
  }
}
