import { Component, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ProfileService } from '../../../core/services/profile/profile.service';
import { ToastService } from '../../../shared/services/toast.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [DatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  profile = signal<any>(null);
  loading = signal(false);
  activeTab = signal<'profile' | 'password'>('profile');

  // Profile form
  editName = signal('');
  editEmail = signal('');
  saving = signal(false);

  // Password form
  currentPass = signal('');
  newPass = signal('');
  confirmPass = signal('');
  passLoading = signal(false);
  showCurrent = signal(false);
  showNew = signal(false);
  showConfirm = signal(false);

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading.set(true);
    this.profileService.getProfile().subscribe({
      next: (res) => {
        this.profile.set(res.data);
        this.editName.set(res.data.fullName);
        this.editEmail.set(res.data.email);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  saveProfile() {
    if (!this.editName().trim() || !this.editEmail().trim()) {
      this.toast.warning('Name and email are required!');
      return;
    }
    this.saving.set(true);
    this.profileService
      .updateProfile({
        fullName: this.editName(),
        email: this.editEmail(),
      })
      .subscribe({
        next: () => {
          this.saving.set(false);
          // Update localStorage
          localStorage.setItem('fullName', this.editName());
          this.toast.success('Profile updated successfully!');
          this.loadProfile();
        },
        error: (err) => {
          this.saving.set(false);
          this.toast.error(err.error?.message || 'Update failed!');
        },
      });
  }

  changePassword() {
    if (!this.currentPass() || !this.newPass() || !this.confirmPass()) {
      this.toast.warning('All fields are required!');
      return;
    }
    if (this.newPass() !== this.confirmPass()) {
      this.toast.error('Passwords do not match!');
      return;
    }
    if (this.newPass().length < 6) {
      this.toast.error('Password must be at least 6 characters!');
      return;
    }

    this.passLoading.set(true);
    this.profileService
      .changePassword({
        currentPassword: this.currentPass(),
        newPassword: this.newPass(),
        confirmPassword: this.confirmPass(),
      })
      .subscribe({
        next: () => {
          this.passLoading.set(false);
          this.currentPass.set('');
          this.newPass.set('');
          this.confirmPass.set('');
          this.toast.success('Password changed! Please login again.');
          setTimeout(() => this.authService.logout(), 2000);
        },
        error: (err) => {
          this.passLoading.set(false);
          this.toast.error(err.error?.message || 'Password change failed!');
        },
      });
  }

  getInitials(): string {
    return this.profile()?.fullName?.charAt(0)?.toUpperCase() || 'U';
  }

  getRoleColor(): string {
    const colors: any = {
      Admin: '#e74c3c',
      Teacher: '#27ae60',
      Student: '#2980b9',
      Parent: '#8e44ad',
    };
    return colors[this.profile()?.role] || '#888';
  }
}
