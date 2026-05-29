import { Component, computed, signal } from '@angular/core';
import { TimetableModel } from '../../../core/models/timetable.model';
import { ReusableTable, TableColumn } from '../../../shared/components/table/reusable-table/reusable-table';
import { FormField as FF, ReusableForm } from '../../../shared/components/form/reusable-form/reusable-form';
import { TimetableService } from '../../../core/services/time-table/timetable.service';
import { ClassService } from '../../../core/services/classes/class.service';
import { SubjectService } from '../../../core/services/subject/subject.service';
import { TeacherService } from '../../../core/services/teacher-service/teacher.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-time-table',
  imports: [ReusableTable, ReusableForm],
  templateUrl: './time-table.html',
  styleUrl: './time-table.scss',
})
export class TimeTable {
  timetables = signal<TimetableModel[]>([]);
  loading = signal(false);
  formVisible = signal(false);
  formLoading = signal(false);
  editModel = signal<any>({});
  isEdit = signal(false);

  classes = signal<any[]>([]);
  subjects = signal<any[]>([]);
  teachers = signal<any[]>([]);

  // View mode
  viewMode = signal<'table' | 'grid'>('grid');
  selectedClass = signal(0);

  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Filtered subjects by class
  filteredSubjects = computed(() => {
    const classId = this.editModel().classId;
    if (!classId) return this.subjects();
    return this.subjects().filter((s) => s.classId === classId);
  });

  // Grid data — days x time slots
  gridData = computed(() => {
    const data = this.selectedClass()
      ? this.timetables().filter((t) => t.classId === this.selectedClass())
      : this.timetables();

    const grid: any = {};
    this.days.forEach((day) => {
      grid[day] = data
        .filter((t) => t.dayOfWeek === day)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
    });
    return grid;
  });

  columns: TableColumn[] = [
    { key: 'dayOfWeek', label: 'Day' },
    { key: 'className', label: 'Class' },
    { key: 'subjectName', label: 'Subject' },
    { key: 'teacherName', label: 'Teacher' },
    { key: 'startTime', label: 'Start' },
    { key: 'endTime', label: 'End' },
  ];

  get formFields(): FF[] {
    return [
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
      {
        key: 'subjectId',
        label: 'Subject',
        type: 'select',
        required: true,
        options: this.filteredSubjects().map((s) => ({ label: s.subjectName, value: s.id })),
      },
      {
        key: 'teacherId',
        label: 'Teacher',
        type: 'select',
        required: true,
        options: this.teachers().map((t) => ({ label: t.fullName, value: t.id })),
      },
      {
        key: 'dayOfWeek',
        label: 'Day',
        type: 'select',
        required: true,
        options: this.days.map((d) => ({ label: d, value: d })),
      },
      { key: 'startTime', label: 'Start Time', type: 'time', required: true, placeholder: '08:00' },
      { key: 'endTime', label: 'End Time', type: 'time', required: true, placeholder: '09:00' },
    ];
  }

  constructor(
    private timetableService: TimetableService,
    private classService: ClassService,
    private subjectService: SubjectService,
    private teacherService: TeacherService,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.loadAll();
    this.classService.getAll().subscribe({ next: (res) => this.classes.set(res.data) });
    this.subjectService.getAll().subscribe({ next: (res) => this.subjects.set(res.data) });
    this.teacherService.getAll().subscribe({ next: (res) => this.teachers.set(res.data) });
  }

  loadAll() {
    this.loading.set(true);
    this.timetableService.getAll().subscribe({
      next: (res) => {
        this.timetables.set(res.data);
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

  openEdit(t: TimetableModel) {
    this.isEdit.set(true);
    this.editModel.set({ ...t });
    this.formVisible.set(true);
  }

  onDelete(t: TimetableModel) {
    if (confirm(`Delete ${t.subjectName} on ${t.dayOfWeek}?`)) {
      this.timetableService.delete(t.id).subscribe({
        next: () => {
          this.loadAll();
          this.toast.success('Deleted!');
        },
        error: () => this.toast.error('Delete failed!'),
      });
    }
  }

  onSave(data: any) {
    this.formLoading.set(true);
    const call = this.isEdit()
      ? this.timetableService.update(data.id, data)
      : this.timetableService.create(data);
    call.subscribe({
      next: () => {
        this.formLoading.set(false);
        this.formVisible.set(false);
        this.loadAll();
        this.toast.success(this.isEdit() ? 'Updated!' : 'Added!');
      },
      error: (err) => {
        this.formLoading.set(false);
        this.toast.error('Time conflict or error!');
      },
    });
  }

  onCancel() {
    this.formVisible.set(false);
  }

  getDayColor(day: string): string {
    const colors: any = {
      Monday: '#2980b9',
      Tuesday: '#27ae60',
      Wednesday: '#8e44ad',
      Thursday: '#e67e22',
      Friday: '#e74c3c',
      Saturday: '#16a085',
    };
    return colors[day] || '#888';
  }
}
