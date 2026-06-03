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
    { label: 'Reports', icon: 'bi-bar-chart-fill', route: '/reports', roles: ['Admin', 'Teacher'] },
    { label: 'Settings', icon: 'bi-gear-fill', route: '/settings', roles: ['Admin'] },
    // Student only items
    { label: 'Bulk Import', icon: 'bi-upload', route: '/bulk-import', roles: ['Admin'] },
    {
      label: 'Holidays',
      icon: 'bi-calendar-heart',
      route: '/holidays',
      roles: ['Admin', 'Teacher', 'Student', 'Parent'],
    },
    { label: 'My Result', icon: 'bi-award', route: '/my-result', roles: ['Student'] },
    {
      label: 'My Attendance',
      icon: 'bi-calendar-check',
      route: '/my-attendance',
      roles: ['Student'],
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
            ['Students', 'Teachers', 'Classes', 'Subjects', 'Reports'].includes(i.label) &&
            i.roles.includes(role),
        ),
      },
      {
        title: 'Management',
        items: this.allMenuItems.filter(
          (i) =>
            [
              'Attendance',
              'My Attendance',
              'My Result',
              'Exams',
              'Datesheet',
              'Timetable',
              'Bulk Import',
            ].includes(i.label) && i.roles.includes(role),
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
