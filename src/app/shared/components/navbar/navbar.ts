import { Component, output } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  toggleSidebar = output<void>();
  toggleMobile = output<void>();
  fullName = '';
  role = '';

  constructor(private authService: AuthService) {
    this.fullName = authService.getFullName();
    this.role = authService.getRole();
  }

  onToggle() {
    this.toggleSidebar.emit();
  }

  logout() {
    this.authService.logout();
  }

  onMobileToggle() {
    this.toggleMobile.emit();
  }
}
