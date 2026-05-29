import { Component, computed, signal } from '@angular/core';
import { NoticeModel } from '../../../core/models/notice.model';
import { ToastService } from '../../../shared/services/toast.service';
import { NoticesService } from '../../../core/services/notices/notices.service';

@Component({
  selector: 'app-notices',
  imports: [],
  templateUrl: './notices.html',
  styleUrl: './notices.scss',
})
export class Notices {
  notices = signal<NoticeModel[]>([]);
  loading = signal(false);
  formVisible = signal(false);
  formLoading = signal(false);
  isEdit = signal(false);
  editModel = signal<any>({});
  searchQuery = signal('');

  // Form fields
  formTitle = signal('');
  formDescription = signal('');

  filteredNotices = computed(() => {
    const q = this.searchQuery().toLowerCase();
    if (!q) return this.notices();
    return this.notices().filter(
      (n) => n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q),
    );
  });

  constructor(
    private noticeService: NoticesService,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.loadNotices();
  }

  loadNotices() {
    this.loading.set(true);
    this.noticeService.getAll().subscribe({
      next: (res) => {
        this.notices.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openAdd() {
    this.isEdit.set(false);
    this.formTitle.set('');
    this.formDescription.set('');
    this.formVisible.set(true);
  }

  openEdit(n: NoticeModel) {
    this.isEdit.set(true);
    this.editModel.set({ ...n });
    this.formTitle.set(n.title);
    this.formDescription.set(n.description);
    this.formVisible.set(true);
  }

  onDelete(n: NoticeModel) {
    if (confirm(`Delete "${n.title}"?`)) {
      this.noticeService.delete(n.id).subscribe({
        next: () => {
          this.loadNotices();
          this.toast.success('Notice deleted!');
        },
        error: () => this.toast.error('Delete failed!'),
      });
    }
  }

  onSave() {
    if (!this.formTitle().trim()) {
      this.toast.warning('Title is required!');
      return;
    }

    this.formLoading.set(true);
    const data = {
      title: this.formTitle(),
      description: this.formDescription(),
      createdBy: Number(localStorage.getItem('userId') || 1),
    };

    const call = this.isEdit()
      ? this.noticeService.update(this.editModel().id, data)
      : this.noticeService.create(data);

    call.subscribe({
      next: () => {
        this.formLoading.set(false);
        this.formVisible.set(false);
        this.loadNotices();
        this.toast.success(this.isEdit() ? 'Notice updated!' : 'Notice added!');
      },
      error: () => {
        this.formLoading.set(false);
        this.toast.error('Something went wrong!');
      },
    });
  }

  onCancel() {
    this.formVisible.set(false);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-PK', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  getInitials(title: string): string {
    return title.charAt(0).toUpperCase();
  }
}
