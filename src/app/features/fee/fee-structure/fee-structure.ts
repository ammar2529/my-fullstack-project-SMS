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
    { key: 'amount', label: 'Amount', pipe: 'currency' },
    { key: 'class.className', label: 'Class Name' },
  ];

  formFields: FF[] = [
    {
      key: 'feeType',
      label: 'Fee Type',
      type: 'text',
      required: true,
      placeholder: 'e.g., Monthly Fee',
    },
    {
      key: 'amount',
      label: 'Amount (PKR)',
      type: 'number',
      required: true,
      placeholder: 'e.g., 2500',
    },
    { key: 'classId', label: 'Select Class', type: 'select', required: true, options: [] },
  ];

  constructor(
    private feeStructureService: FeeService,
    private classService: ClassService,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    debugger;
    this.loadFeeStructures();
    this.loadClasses();
  }

  loadClasses() {
    this.classService.getAll().subscribe({
      next: (res) => {
        this.allClasses.set(res.data);
        const classField = this.formFields.find((f) => f.key === 'classId');
        if (classField) {
          classField.options = res.data.map((c: any) => ({
            label: `${c.className} - ${c.section}`,
            value: c.id,
          }));
        }
      },
    });
  }

  loadFeeStructures() {
    this.loading.set(true);
    this.feeStructureService.getAll().subscribe({
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
    if (confirm(`Delete fee structure for ${fs.feeType}?`)) {
      this.feeStructureService.delete(fs.id).subscribe({
        next: () => {
          this.loadFeeStructures();
          this.toast.success('Fee structure deleted!');
        },
        error: () => this.toast.error('Delete failed!'),
      });
    }
  }

  onSave(data: any) {
    this.formLoading.set(true);
    const call = this.isEdit()
      ? this.feeStructureService.update(data.id, data)
      : this.feeStructureService.create(data);

    call.subscribe({
      next: () => {
        this.formLoading.set(false);
        this.formVisible.set(false);
        this.loadFeeStructures();
        this.toast.success(this.isEdit() ? 'Fee structure updated!' : 'Fee structure added!');
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
}
