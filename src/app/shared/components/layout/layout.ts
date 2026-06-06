import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Sidebar } from '../sidebar/sidebar';
import { Toast } from '../toast/toast';
import { SettingsService } from '../../../core/services/settings/settings.service';
import { NotificationService } from '../../../core/services/notification/notification.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Navbar, Sidebar, Toast],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  mobileOpen = signal(false);

  sidebarCollapsed = signal(false);
  schoolName = signal('SchoolMS');
  constructor(
    private settingsService: SettingsService,
    private notifService: NotificationService, // ← Add
  ) {}

  ngOnInit() {
    this.settingsService.getSettings().subscribe({
      next: (res) => this.schoolName.set(res.data?.schoolName || 'SchoolMS'),
    });
    // Notifications auto load
    this.notifService.loadNotifications();

    // Har 5 minute mein refresh
    setInterval(() => this.notifService.loadNotifications(), 5 * 60 * 1000);
  }

  toggleSidebar() {
    this.sidebarCollapsed.update((v) => !v);
  }
  toggleMobile() {
    this.mobileOpen.update((v) => !v);
  }
  closeMobile() {
    this.mobileOpen.set(false);
  }
}
