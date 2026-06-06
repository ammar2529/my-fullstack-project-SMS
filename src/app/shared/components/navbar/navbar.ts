import { Component, input, Input, output, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../../core/services/notification/notification.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  toggleSidebar = output<void>();
  toggleMobile = output<void>();
  showNotifPanel = signal(false);

  fullName = '';
  role = '';
  schoolName = input('SchoolMS');

  constructor(
    private authService: AuthService,
    public notifService: NotificationService,
  ) {
    this.fullName = authService.getFullName();
    this.role = authService.getRole();
  }

  onToggle() {
    this.toggleSidebar.emit();
  }

  logout() {
    this.authService.logout();
  }

  onMobileToggle() {
    this.toggleMobile.emit();
  }

  toggleNotifPanel() {
    debugger
    this.showNotifPanel.update((v) => !v);
  }

  getNotifIcon(type: string): string {
    const icons: any = {
      success: 'bi-check-circle-fill text-success',
      info: 'bi-info-circle-fill text-primary',
      warning: 'bi-exclamation-triangle-fill text-warning',
      error: 'bi-x-circle-fill text-danger',
    };
    return icons[type] || 'bi-bell-fill';
  }

  formatTime(time: Date): string {
    const diff = (Date.now() - new Date(time).getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(time).toLocaleDateString();
  }
}
