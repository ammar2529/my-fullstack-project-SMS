import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
}
@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  collapsed = input(false);
  mobileOpen = input(false);
  closeMenu = output<void>();
  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'bi-speedometer2', route: '/dashboard' },
    { label: 'Students', icon: 'bi-people-fill', route: '/students' },
    { label: 'Teachers', icon: 'bi-person-badge', route: '/teachers' },
    { label: 'Classes', icon: 'bi-building', route: '/classes' },
    { label: 'Subjects', icon: 'bi-book-fill', route: '/subjects' },
    { label: 'Attendance', icon: 'bi-calendar-check', route: '/attendance' },
    { label: 'Exams', icon: 'bi-pencil-square', route: '/exams' },
    { label: 'Fee Configuration', icon: 'bi-sliders', route: '/fee-structures' },
    { label: 'Fee Payments', icon: 'bi-cash-stack', route: '/fee-payments' },
    { label: 'Timetable', icon: 'bi-clock-fill', route: '/timetable' },
    { label: 'Library', icon: 'bi-journal-bookmark', route: '/library' },
    { label: 'Transport', icon: 'bi-bus-front-fill', route: '/transport' },
    { label: 'Notices', icon: 'bi-megaphone-fill', route: '/notices' },
  ];

  onNavClick() {
    this.closeMenu.emit();
  }
}
