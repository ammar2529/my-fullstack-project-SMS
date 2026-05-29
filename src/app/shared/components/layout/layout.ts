import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Sidebar } from '../sidebar/sidebar';
import { Toast } from '../toast/toast';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Navbar, Sidebar, Toast],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  mobileOpen = signal(false);

  sidebarCollapsed = signal(false);

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
