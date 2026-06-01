import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Sidebar } from '../sidebar/sidebar';
import { Toast } from '../toast/toast';
import { SettingsService } from '../../../core/services/settings/settings.service';

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
  constructor(private settingsService: SettingsService) {}
  ngOnInit() {
    this.settingsService.getSettings().subscribe({
      next: (res) => this.schoolName.set(res.data?.schoolName || 'SchoolMS'),
    });
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
