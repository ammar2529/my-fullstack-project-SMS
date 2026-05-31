import { Routes } from '@angular/router';
import { Layout } from '../../shared/components/layout/layout';
import { roleGuard } from '../../core/guards/role-guard';


const ADMIN = ['Admin'];
const ADMIN_TEACHER = ['Admin', 'Teacher'];
const ALL_ROLES = ['Admin', 'Teacher', 'Student', 'Parent'];
export const dashboardRoutes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'students',
        canActivate: [roleGuard],
        data: { roles: ADMIN_TEACHER },
        loadComponent: () => import('../student/student').then((m) => m.Student),
      },
      {
        path: 'teachers',
        canActivate: [roleGuard],
        data: { roles: ADMIN },
        loadComponent: () => import('../teachers/teacher/teacher').then((m) => m.Teacher),
      },
      {
        path: 'classes',
        canActivate: [roleGuard],
        data: { roles: ADMIN },
        loadComponent: () => import('../classes/classes/classes').then((m) => m.Classes),
      },
      {
        path: 'subjects',
        canActivate: [roleGuard],
        data: { roles: ADMIN },
        loadComponent: () => import('../subject/subject/subject').then((m) => m.Subject),
      },
      {
        path: 'attendance',
        canActivate: [roleGuard],
        data: { roles: ADMIN_TEACHER },
        loadComponent: () =>
          import('../attendance/attendance/attendance').then((m) => m.Attendance),
      },
      {
        path: 'exams',
        canActivate: [roleGuard],
        data: { roles: ADMIN_TEACHER },

        loadComponent: () => import('../exams/exams/exams').then((m) => m.Exams),
      },

      // =========================================================================
      // 🔥 FEE MODULE PATHS (Aapke project ke folder structure ke mutabiq add kiye)
      // =========================================================================
      {
        path: 'fee-structures',
        canActivate: [roleGuard],
        data: { roles: ADMIN },
        loadComponent: () =>
          import('../fee/fee-structure/fee-structure').then((m) => m.FeeStructure),
      },
      {
        path: 'fee-payments',
        canActivate: [roleGuard],
        data: { roles: ADMIN },
        loadComponent: () => import('../fee/fee-payment/fee-payment').then((m) => m.FeePayment),
      },

      {
        path: 'timetable',
        canActivate: [roleGuard],
        data: { roles: ALL_ROLES },
        loadComponent: () => import('../time-table/time-table/time-table').then((m) => m.TimeTable),
      },
      {
        path: 'notices',
        canActivate: [roleGuard],
        data: { roles: ALL_ROLES },
        loadComponent: () => import('../notices/notices/notices').then((m) => m.Notices),
      },

      {
        path: 'library',
        canActivate: [roleGuard],
        data: { roles: ADMIN_TEACHER },
        loadComponent: () => import('../library/library/library').then((m) => m.Library),
      },
      {
        path: 'transport',
        canActivate: [roleGuard],
        data: { roles: ADMIN },
        loadComponent: () => import('../transport/transport/transport').then((m) => m.Transport),
      },
      {
        path: 'datesheet',
        loadComponent: () => import('../datesheet/datesheet/datesheet').then((m) => m.Datesheet),
      },
      {
        path: 'profile',
        loadComponent: () => import('../profile/profile/profile').then((m) => m.Profile),
      },
      {
        path: 'reports',
        loadComponent: () => import('../report/report/report').then((m) => m.Report),
      },
    ],
  },
];


