import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReusableTable, TableColumn } from '../../../shared/components/table/reusable-table/reusable-table';
import { FormField as ff } from '@angular/forms/signals';
import { FormField as FF, ReusableForm } from '../../../shared/components/form/reusable-form/reusable-form';
import { ClassService } from '../../../core/services/classes/class.service';
import { ToastService } from '../../../shared/services/toast.service';
import { FeeService } from '../../../core/services/fee/fee.service';

@Component({
  selector: 'app-fee-structure',
  imports: [ReusableForm, ReusableTable],
  templateUrl: './fee-structure.html',
  styleUrl: './fee-structure.scss',
})
export class FeeStructure {
  feeStructures = signal<any[]>([]);
  allClasses = signal<any[]>([]);
  loading = signal(false);
  formVisible = signal(false);
  formLoading = signal(false);
  editModel = signal<any>({});
  isEdit = signal(false);

  columns: TableColumn[] = [
    { key: 'feeType', label: 'Fee Type' },
    { key: 'feeCategory', label: 'Category' },
    { key: 'className', label: 'Class' },
    { key: 'amount', label: 'Amount (Rs)' },
    { key: 'description', label: 'Description' },
  ];

  get formFields(): FF[] {
    return [
      {
        key: 'classId',
        label: 'Class',
        type: 'select',
        required: true,
        options: this.allClasses().map((c) => ({
          label: `${c.className} - ${c.section}`,
          value: c.id,
        })),
      },
      {
        key: 'feeType',
        label: 'Fee Type',
        type: 'select',
        required: true,
        options: [
          { label: 'Monthly Fee', value: 'Monthly Fee' },
          { label: 'Admission Fee', value: 'Admission Fee' },
          { label: 'Exam Fee', value: 'Exam Fee' },
          { label: 'Sports Fee', value: 'Sports Fee' },
          { label: 'Computer Fee', value: 'Computer Fee' },
          { label: 'Transport Fee', value: 'Transport Fee' },
          { label: 'Library Fee', value: 'Library Fee' },
          { label: 'Security Deposit', value: 'Security Deposit' },
          { label: 'Annual Fund', value: 'Annual Fund' },
          { label: 'Other', value: 'Other' },
        ],
      },
      {
        key: 'feeCategory',
        label: 'Category',
        type: 'select',
        required: true,
        options: [
          { label: 'Monthly (Every Month)', value: 'Monthly' },
          { label: 'One Time (Once Only)', value: 'OneTime' },
          { label: 'Optional (As Needed)', value: 'Optional' },
        ],
      },
      { key: 'amount', label: 'Amount (Rs)', type: 'number', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
    ];
  }

  constructor(
    private feeService: FeeService,
    private classService: ClassService,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.loadFeeStructures();
    this.loadClasses();
  }

  loadClasses() {
    this.classService.getAll().subscribe({
      next: (res) => this.allClasses.set(res.data),
    });
  }

  loadFeeStructures() {
    this.loading.set(true);
    this.feeService.getAll().subscribe({
      next: (res) => {
        this.feeStructures.set(res.data);
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
  openEdit(fs: any) {
    this.isEdit.set(true);
    this.editModel.set({ ...fs });
    this.formVisible.set(true);
  }

  onDelete(fs: any) {
    if (confirm(`Delete "${fs.feeType}"?`)) {
      this.feeService.delete(fs.id).subscribe({
        next: () => {
          this.loadFeeStructures();
          this.toast.success('Deleted!');
        },
        error: () => this.toast.error('Delete failed!'),
      });
    }
  }

  onSave(data: any) {
    this.formLoading.set(true);
    const call = this.isEdit()
      ? this.feeService.update(data.id, data)
      : this.feeService.create(data);
    call.subscribe({
      next: () => {
        this.formLoading.set(false);
        this.formVisible.set(false);
        this.loadFeeStructures();
        this.toast.success(this.isEdit() ? 'Updated!' : 'Fee type added!');
      },
      error: () => {
        this.formLoading.set(false);
        this.toast.error('Error!');
      },
    });
  }

  onCancel() {
    this.formVisible.set(false);
  }
}
