import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles: string[];
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

  constructor(private authService: AuthService) {}
  userRole = computed(() => this.authService.getRole());
  allMenuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'bi-speedometer2',
      route: '/dashboard',
      roles: ['Admin', 'Teacher', 'Student', 'Parent'],
    },
    { label: 'Students', icon: 'bi-people-fill', route: '/students', roles: ['Admin', 'Teacher'] },
    { label: 'Teachers', icon: 'bi-person-badge', route: '/teachers', roles: ['Admin'] },
    { label: 'Classes', icon: 'bi-building', route: '/classes', roles: ['Admin'] },
    { label: 'Subjects', icon: 'bi-book-fill', route: '/subjects', roles: ['Admin'] },
    {
      label: 'Attendance',
      icon: 'bi-calendar-check',
      route: '/attendance',
      roles: ['Admin', 'Teacher'],
    },
    { label: 'Exams', icon: 'bi-pencil-square', route: '/exams', roles: ['Admin', 'Teacher'] },
    { label: 'Fee Configuration', icon: 'bi-sliders', route: '/fee-structures', roles: ['Admin'] },
    { label: 'Fee Payments', icon: 'bi-cash-stack', route: '/fee-payments', roles: ['Admin'] },
    {
      label: 'Timetable',
      icon: 'bi-clock-fill',
      route: '/timetable',
      roles: ['Admin', 'Teacher', 'Student', 'Parent'],
    },
    {
      label: 'Library',
      icon: 'bi-journal-bookmark',
      route: '/library',
      roles: ['Admin', 'Teacher'],
    },
    { label: 'Transport', icon: 'bi-bus-front-fill', route: '/transport', roles: ['Admin'] },
    {
      label: 'Notices',
      icon: 'bi-megaphone-fill',
      route: '/notices',
      roles: ['Admin', 'Teacher', 'Student', 'Parent'],
    },
    {
      label: 'Datesheet',
      icon: 'bi-calendar-event',
      route: '/datesheet',
      roles: ['Admin', 'Teacher', 'Student', 'Parent'],
    },
  ];

  // menuItems = computed(() =>
  //   this.allMenuItems.filter((item) => item.roles.includes(this.userRole())),
  // );

  menuGroups = computed(() => {
    const role = this.userRole();
    return [
      {
        title: 'Main',
        items: this.allMenuItems.filter(
          (i) => ['Dashboard'].includes(i.label) && i.roles.includes(role),
        ),
      },
      {
        title: 'Academic',
        items: this.allMenuItems.filter(
          (i) =>
            ['Students', 'Teachers', 'Classes', 'Subjects'].includes(i.label) &&
            i.roles.includes(role),
        ),
      },
      {
        title: 'Management',
        items: this.allMenuItems.filter(
          (i) =>
            ['Attendance', 'Exams', 'Datesheet', 'Timetable'].includes(i.label) &&
            i.roles.includes(role),
        ),
      },
      {
        title: 'Finance & Other',
        items: this.allMenuItems.filter(
          (i) =>
            ['Fee Configuration', 'Fee Payments', 'Library', 'Transport', 'Notices'].includes(
              i.label,
            ) && i.roles.includes(role),
        ),
      },
    ].filter((g) => g.items.length > 0);
  });

  onNavClick() {
    this.closeMenu.emit();
  }
}
