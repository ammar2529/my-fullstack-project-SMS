import { Component, signal } from '@angular/core';
import { ReusableTable, TableColumn } from '../../../shared/components/table/reusable-table/reusable-table';
import { TeacherService } from '../../../core/services/teacher-service/teacher.service';
import { Teacher as TeacherModel } from '../../../core/models/teacher.model';
import {
  ReusableForm,
  FormField as FF,
} from '../../../shared/components/form/reusable-form/reusable-form';
import { TeacherClassService } from '../../../core/services/teacher-class/teacher-class.service';
import { ClassService } from '../../../core/services/classes/class.service';
import { ToastService } from '../../../shared/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';



@Component({
  selector: 'app-teacher',
  imports: [ReusableTable, ReusableForm],
  templateUrl: './teacher.html',
  styleUrl: './teacher.scss',
})
export class Teacher {
  teachers = signal<TeacherModel[]>([]);
  loading = signal(false);
  formVisible = signal(false);
  formLoading = signal(false);
  editModel = signal<any>({});
  isEdit = signal(false);

  // Assign Class Modal
  assignVisible = signal(false);
  selectedTeacher = signal<any>(null);
  assignedClasses = signal<any[]>([]);
  allClasses = signal<any[]>([]);
  selectedClassId = signal(0);
  assignLoading = signal(false);

  columns: TableColumn[] = [
    { key: 'employeeCode', label: 'Emp Code' },
    { key: 'fullName', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'qualification', label: 'Qualification' },
    { key: 'salary', label: 'Salary' },
    { key: 'assignedClasses', label: 'Assigned Classes' },
  ];

  formFields: FF[] = [
    { key: 'fullName', label: 'Full Name', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'employeeCode', label: 'Employee Code', type: 'text', required: true },
    { key: 'qualification', label: 'Qualification', type: 'text', required: true },
    { key: 'joiningDate', label: 'Joining Date', type: 'date', required: true },
    { key: 'salary', label: 'Salary', type: 'number', required: true },
  ];

  constructor(
    private teacherService: TeacherService,
    private teacherClassService: TeacherClassService,
    private classService: ClassService,
    private toast: ToastService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.loadTeachers();
    this.classService.getAll().subscribe({
      next: (res) => this.allClasses.set(res.data),
    });
  }

  loadTeachers() {
    this.loading.set(true);
    this.teacherService.getAll().subscribe({
      next: (res) => {
        this.teachers.set(res.data);
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

  openEdit(t: TeacherModel) {
    this.isEdit.set(true);
    this.editModel.set({ ...t });
    this.formVisible.set(true);
  }

  onDelete(t: TeacherModel) {
    if (confirm(`Delete ${t.fullName}?`)) {
      this.teacherService.delete(t.id).subscribe({
        next: () => {
          this.loadTeachers();
          this.toast.success('Teacher deleted!');
        },
        error: () => this.toast.error('Delete failed!'),
      });
    }
  }

  onSave(data: any) {
    this.formLoading.set(true);
    const call = this.isEdit()
      ? this.teacherService.update(data.id, data)
      : this.teacherService.create(data);
    call.subscribe({
      next: () => {
        this.formLoading.set(false);
        this.formVisible.set(false);
        this.loadTeachers();
        this.toast.success(this.isEdit() ? 'Teacher updated!' : 'Teacher added!');
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

  // =============================================
  // ASSIGN CLASS
  // =============================================
  openAssign(teacher: any) {
    this.selectedTeacher.set(teacher);
    this.assignVisible.set(true);
    this.selectedClassId.set(0);
    this.loadAssignedClasses(teacher.id);
  }

  loadAssignedClasses(teacherId: number) {
    this.teacherClassService.getByTeacher(teacherId).subscribe({
      next: (res) => this.assignedClasses.set(res.data),
    });
  }

  assignClass() {
    if (!this.selectedClassId()) return;
    this.assignLoading.set(true);
    this.teacherClassService.assign(this.selectedTeacher().id, this.selectedClassId()).subscribe({
      next: () => {
        this.assignLoading.set(false);
        this.selectedClassId.set(0);
        this.loadAssignedClasses(this.selectedTeacher().id);
        this.toast.success('Class assigned!');
      },
      error: (err) => {
        this.assignLoading.set(false);
        this.toast.error('Already assigned or error!');
      },
    });
  }

  removeClass(id: number) {
    this.teacherClassService.remove(id).subscribe({
      next: () => {
        this.loadAssignedClasses(this.selectedTeacher().id);
        this.toast.success('Class removed!');
      },
      error: () => this.toast.error('Remove failed!'),
    });
  }

  closeAssign() {
    this.assignVisible.set(false);
  }

  // Available classes — jo already assign nahi hain
  get availableClasses() {
    const assigned = this.assignedClasses().map((a) => a.classId);
    return this.allClasses().filter((c) => !assigned.includes(c.id));
  }

  get roleId(): number {

    return this.authService.getRoleId(); // localStorage se roleId nikal lega
  }
}
