import { Routes } from '@angular/router';
import { Layout } from '../../shared/components/layout/layout';

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
        loadComponent: () => import('../student/student').then((m) => m.Student),
      },
      {
        path: 'teachers',
        loadComponent: () => import('../teachers/teacher/teacher').then((m) => m.Teacher),
      },
      {
        path: 'classes',
        loadComponent: () => import('../classes/classes/classes').then((m) => m.Classes),
      },
      {
        path: 'subjects',
        loadComponent: () => import('../subject/subject/subject').then((m) => m.Subject),
      },
      {
        path: 'attendance',
        loadComponent: () =>
          import('../attendance/attendance/attendance').then((m) => m.Attendance),
      },
      {
        path: 'exams',
        loadComponent: () => import('../exams/exams/exams').then((m) => m.Exams),
      },

      // =========================================================================
      // 🔥 FEE MODULE PATHS (Aapke project ke folder structure ke mutabiq add kiye)
      // =========================================================================
      {
        path: 'fee-structures',
        loadComponent: () =>
          import('../fee/fee-structure/fee-structure').then((m) => m.FeeStructure),
      },
      {
        path: 'fee-payments',
        loadComponent: () => import('../fee/fee-payment/fee-payment').then((m) => m.FeePayment),
      },

      {
        path: 'timetable',
        loadComponent: () => import('../time-table/time-table/time-table').then((m) => m.TimeTable),
      },
      {
        path: 'notices',
        loadComponent: () => import('../notices/notices/notices').then((m) => m.Notices),
      },
      {
        path: 'timetable',
        loadComponent: () => import('../time-table/time-table/time-table').then((m) => m.TimeTable),
      },
      {
        path: 'library',
        loadComponent: () => import('../library/library/library').then((m) => m.Library),
      },
      {
        path: 'transport',
        loadComponent: () => import('../transport/transport/transport').then((m) => m.Transport),
      },
    ],
  },
];


