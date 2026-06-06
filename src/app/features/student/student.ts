import { Component, OnInit, signal } from '@angular/core';
import {
  ReusableTable,
  TableColumn,
} from '../../shared/components/table/reusable-table/reusable-table';
import { ReusableForm, FormField } from '../../shared/components/form/reusable-form/reusable-form';
import { StudentService } from '../../core/services/student.service';
import { Student as StudentModel } from '../../core/models/student.model';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-student',
  imports: [ReusableTable, ReusableForm],
  templateUrl: './student.html',
  styleUrl: './student.scss',
})
export class Student implements OnInit {
  students = signal<StudentModel[]>([]);
  loading = signal(false);
  formVisible = signal(false);
  formLoading = signal(false);
  editModel = signal<any>({});
  isEdit = signal(false);
  classes = signal<any[]>([]);

  columns: TableColumn[] = [
    { key: 'profilePicture', label: 'Photo' },
    { key: 'rollNo', label: 'Roll No' },
    { key: 'fullName', label: 'Full Name' },
    { key: 'className', label: 'Class' },
    { key: 'section', label: 'Section' },
    { key: 'fatherName', label: 'Father Name' },
    { key: 'phoneNo', label: 'Phone' },
  ];

  get formFields(): FormField[] {
    return [
      { key: 'imageFile', label: 'Profile Picture', type: 'file', required: false }, // ← Naya File Field
      { key: 'fullName', label: 'Full Name', type: 'text', required: true },
      { key: 'email', label: 'Email', type: 'email', required: true },
      { key: 'rollNo', label: 'Roll No', type: 'text', required: true },
      {
        key: 'classId',
        label: 'Class',
        type: 'select',
        required: true,
        options: this.classes().map((c) => ({
          label: c.className + ' - ' + c.section,
          value: c.id,
        })),
      },
      { key: 'fatherName', label: 'Father Name', type: 'text', required: true },
      { key: 'phoneNo', label: 'Phone No', type: 'text', required: true },
      { key: 'dob', label: 'Date of Birth', type: 'date', required: true },
      { key: 'address', label: 'Address', type: 'textarea' },
    ];
  }

  constructor(
    private studentService: StudentService,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.loadStudents();
    this.loadClasses();
  }

  loadStudents() {
    this.loading.set(true);
    this.studentService.getAll().subscribe({
      next: (res) => {
        this.students.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  loadClasses() {
    this.studentService.getClasses().subscribe({
      next: (res) => this.classes.set(res.data),
    });
  }

  openAdd() {
    this.isEdit.set(false);
    this.editModel.set({ imageFile: null });
    this.formVisible.set(true);
  }

  openEdit(student: StudentModel) {
    this.isEdit.set(true);
    this.editModel.set({ ...student, imageFile: null });
    this.formVisible.set(true);
  }

  onDelete(student: StudentModel) {
    if (confirm(`Delete ${student.fullName}?`)) {
      this.studentService.delete(student.id).subscribe({
        next: () => {
          this.loadStudents();
          this.toast.success('Student deleted!');
        },
        error: () => this.toast.error('Delete failed!'),
      });
    }
  }

  onSave(data: any) {
    this.formLoading.set(true);
    debugger;
    const call = this.isEdit()
      ? this.studentService.update(data.id, data)
      : this.studentService.create(data);

    call.subscribe({
      next: () => {
        this.formLoading.set(false);
        this.formVisible.set(false);
        this.loadStudents();
        this.toast.success(this.isEdit() ? 'Student updated!' : 'Student added!');
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
