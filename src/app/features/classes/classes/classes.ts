import { Component, signal } from '@angular/core';
import { ClassModel } from '../../../core/models/class.model';
import { ReusableTable, TableColumn } from '../../../shared/components/table/reusable-table/reusable-table';
import { ClassService } from '../../../core/services/classes/class.service';

import { FormField as FF, ReusableForm } from '../../../shared/components/form/reusable-form/reusable-form';


@Component({
  selector: 'app-classes',
  imports: [ReusableTable, ReusableForm],
  templateUrl: './classes.html',
  styleUrl: './classes.scss',
})
export class Classes {
  classes = signal<ClassModel[]>([]);
  loading = signal(false);
  formVisible = signal(false);
  formLoading = signal(false);
  editModel = signal<any>({});
  isEdit = signal(false);

  columns: TableColumn[] = [
    { key: 'className', label: 'Class Name' },
    { key: 'section', label: 'Section' },
  ];

  formFields: FF[] = [
    {
      key: 'className',
      label: 'Class Name',
      type: 'text',
      required: true,
      placeholder: 'e.g. Class 1',
    },
    { key: 'section', label: 'Section', type: 'text', required: true, placeholder: 'e.g. A' },
  ];

  constructor(private classService: ClassService) {}

  ngOnInit() {
    this.loadClasses();
  }

  loadClasses() {
    this.loading.set(true);
    this.classService.getAll().subscribe({
      next: (res) => {
        this.classes.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openAdd() {
    this.isEdit.set(false);
    this.editModel.set({});
    this.formVisible.set(true);
  }

  openEdit(c: ClassModel) {
    this.isEdit.set(true);
    this.editModel.set({ ...c });
    this.formVisible.set(true);
  }

  onDelete(c: ClassModel) {
    if (confirm(`Delete ${c.className} - ${c.section}?`)) {
      this.classService.delete(c.id).subscribe({ next: () => this.loadClasses() });
    }
  }

  onSave(data: any) {
    this.formLoading.set(true);
    const call = this.isEdit()
      ? this.classService.update(data.id, data)
      : this.classService.create(data);
    call.subscribe({
      next: () => {
        this.formLoading.set(false);
        this.formVisible.set(false);
        this.loadClasses();
      },
      error: () => this.formLoading.set(false),
    });
  }

  onCancel() {
    this.formVisible.set(false);
  }
}
