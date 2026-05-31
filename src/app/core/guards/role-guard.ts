import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const allowedRoles = route.data['roles'] as string[];
  const userRole = authService.getRole();

  if (!authService.isLoggedIn()) {
    router.navigate(['/auth/login']);
    return false;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};
