import { Routes } from '@angular/router';

export const studentRoutes: Routes = [
  {
    path: 'students',
    loadComponent: () => import('./student').then((m) => m.Student),
  },
];
