import { Component, signal } from '@angular/core';
import { SettingsService } from '../../../core/services/settings/settings.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-setting',
  imports: [],
  templateUrl: './setting.html',
  styleUrl: './setting.scss',
})
export class Setting {
  loading = signal(false);
  saving = signal(false);
  isAdmin = signal(false);
  activeTab = signal<'school' | 'academic' | 'account'>('school');

  // School Settings
  schoolName = signal('');
  schoolAddress = signal('');
  phoneNo = signal('');
  email = signal('');
  website = signal('');
  principal = signal('');
  academicYear = signal('');
  city = signal('');
  country = signal('Pakistan');

  constructor(
    private settingsService: SettingsService,
    private authService: AuthService,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.isAdmin.set(this.authService.getRole() === 'Admin');
    this.loadSettings();
  }

  loadSettings() {
    this.loading.set(true);
    this.settingsService.getSettings().subscribe({
      next: (res) => {
        const d = res.data;
        this.schoolName.set(d.schoolName || '');
        this.schoolAddress.set(d.schoolAddress || '');
        this.phoneNo.set(d.phoneNo || '');
        this.email.set(d.email || '');
        this.website.set(d.website || '');
        this.principal.set(d.principal || '');
        this.academicYear.set(d.academicYear || new Date().getFullYear().toString());
        this.city.set(d.city || '');
        this.country.set(d.country || 'Pakistan');
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  saveSettings() {
    if (!this.schoolName().trim()) {
      this.toast.warning('School name is required!');
      return;
    }
    this.saving.set(true);
    this.settingsService
      .saveSettings({
        schoolName: this.schoolName(),
        schoolAddress: this.schoolAddress(),
        phoneNo: this.phoneNo(),
        email: this.email(),
        website: this.website(),
        principal: this.principal(),
        academicYear: this.academicYear(),
        city: this.city(),
        country: this.country(),
      })
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.toast.success('Settings saved successfully!');
        },
        error: () => {
          this.saving.set(false);
          this.toast.error('Save failed!');
        },
      });
  }

  currentYear = new Date().getFullYear();
  years = Array.from({ length: 5 }, (_, i) => this.currentYear - 1 + i);
}
