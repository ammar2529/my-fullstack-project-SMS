import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/auth.model';
import { email, form, FormField, required, submit } from '@angular/forms/signals';

interface LoginData {
  email: string;
  password: string;
}
@Component({
  selector: 'app-login',
  imports: [FormsModule, FormField],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loading = signal(false);
  serverError = signal('');

  loginModel = signal<LoginData>({
    email: '',
    password: '',
  });

  loginForm = form(this.loginModel, (f) => {
    required(f.email, { message: 'Email is required' });
    email(f.email, { message: 'Valid email required' });
    required(f.password, { message: 'Password is required' });
  });

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(event: Event) {
    event.preventDefault();
    submit(this.loginForm, async () => {
      this.loading.set(true);
      this.serverError.set('');

      this.authService.login(this.loginModel()).subscribe({
        next: (res) => {
          this.loading.set(false);
          if (res.success) {
            this.router.navigate(['/dashboard']);
          }
        },
        error: () => {
          this.loading.set(false);
          this.serverError.set('Invalid email or password');
        },
      });
    });
  }
}
