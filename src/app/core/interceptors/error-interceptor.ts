import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../shared/services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((err) => {
      switch (err.status) {
        case 401:
          localStorage.clear();
          router.navigate(['/auth/login']);
          toast.error('Session expired. Please login again.');
          break;
        case 403:
          toast.error('Access denied!');
          router.navigate(['/unauthorized']);
          break;
        case 404:
          toast.warning('Record not found!');
          break;
        case 500:
          toast.error('Server error! Please try again.');
          break;
        case 0:
          toast.error('Cannot connect to server!');
          break;
        default:
          if (err.error?.message) {
            toast.error(err.error.message);
          }
      }
      return throwError(() => err);
    }),
  );
};
