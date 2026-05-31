import { Component, computed, signal } from '@angular/core';
import { AttendanceModel } from '../../../core/models/attendance.model';
import { AttendanceService } from '../../../core/services/attendance/attendance.service';
import { StudentService } from '../../../core/services/student.service';
import { ClassService } from '../../../core/services/classes/class.service';
import { ReusableTable, TableColumn } from '../../../shared/components/table/reusable-table/reusable-table';
import {
  FormField as FF,
  ReusableForm,
} from '../../../shared/components/form/reusable-form/reusable-form';
import { AuthService } from '../../../core/services/auth.service';
import { ClassNamePipe } from '../../../shared/pipes/classname.pipe';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../shared/services/toast.service';
import { environment } from '../../../../environments/environment.development';
interface AttendanceRow {
  studentId: number;
  rollNo: string;
  fullName: string;
  classId: number;
  attendanceDate: string;
  status: string;
  attId: number;
}
@Component({
  selector: 'app-attendance',
  imports: [ClassNamePipe],
  templateUrl: './attendance.html',
  styleUrl: './attendance.scss',
})
export class Attendance {
  classes = signal<any[]>([]);
  rows = signal<AttendanceRow[]>([]);
  loading = signal(false);
  saving = signal(false);
  selectedClass = signal(0);
  selectedDate = signal(new Date().toISOString().split('T')[0]);
  userRole = signal('');
  userId = signal(0);

  presentCount = computed(() => this.rows().filter((r) => r.status === 'Present').length);
  absentCount = computed(() => this.rows().filter((r) => r.status === 'Absent').length);
  leaveCount = computed(() => this.rows().filter((r) => r.status === 'Leave').length);
  totalCount = computed(() => this.rows().length);
  isAdmin = computed(() => this.userRole() === 'Admin');
  isTeacher = computed(() => this.userRole() === 'Teacher');

  constructor(
    private attendanceService: AttendanceService,
    private classService: ClassService,
    private authService: AuthService,
    private toast: ToastService,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.userRole.set(this.authService.getRole());
    this.userId.set(Number(localStorage.getItem('userId')));

    if (this.isAdmin()) {
      this.classService.getAll().subscribe({
        next: (res) => {
          this.classes.set(res.data);
          this.loadAllStudents();
        },
      });
    } else if (this.isTeacher()) {
      // Teacher ki assigned classes load karo
      const teacherId = Number(localStorage.getItem('roleId'));
      this.userId.set(teacherId);
      this.loadTeacherClasses(teacherId);
    }
  }
  loadTeacherClasses(teacherId: number) {
    this.http.get<any>(`${environment.baseUrl}/TeacherClasses/byteacher/${teacherId}`).subscribe({
      next: (res) => {
        if (res.data && res.data.length > 0) {
          // Classes format karo
          const teacherClasses = res.data.map((tc: any) => ({
            id: tc.classId,
            className: tc.className.split(' - ')[0],
            section: tc.className.split(' - ')[1] || '',
          }));
          this.classes.set(teacherClasses);

          // Pehli class auto select karo
          this.selectedClass.set(teacherClasses[0].id);
          this.loadAttendance();
        } else {
          this.classes.set([]);
        }
      },
      error: () => this.classes.set([]),
    });
  }
  loadAllStudents() {
    this.loading.set(true);
    const date = this.selectedDate();
    const allCls = this.classes();
    const promises = allCls.map((c) =>
      this.attendanceService.getByClassAndDate(c.id, date).toPromise(),
    );

    Promise.all(promises)
      .then((results) => {
        const allRows: AttendanceRow[] = [];
        results.forEach((res) => {
          if (res?.data) allRows.push(...res.data);
        });
        this.rows.set(allRows);
        this.loading.set(false);
      })
      .catch(() => this.loading.set(false));
  }

  loadTeacherAttendance() {
    this.loading.set(true);
    const teacherId = this.userId();
    console.log('Loading for teacherId:', teacherId); // Debug
    this.attendanceService.getByTeacher(this.userId(), this.selectedDate()).subscribe({
      next: (res) => {
        console.log('Teacher attendance:', res); // Debug
        this.rows.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  loadAttendance() {
    if (this.isTeacher()) {
      this.loadTeacherAttendance();
      return;
    }

    // Admin
    if (!this.selectedClass()) {
      this.loadAllStudents();
      return;
    }

    this.loading.set(true);
    this.attendanceService.getByClassAndDate(this.selectedClass(), this.selectedDate()).subscribe({
      next: (res) => {
        this.rows.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  setStatus(row: AttendanceRow, status: string) {
    this.rows.update((rows) =>
      rows.map((r) => (r.studentId === row.studentId ? { ...r, status } : r)),
    );
  }

  markAll(status: string) {
    this.rows.update((rows) => rows.map((r) => ({ ...r, status })));
  }

  saveAttendance() {
    this.saving.set(true);
    const payload = this.rows().map((r) => ({
      studentId: r.studentId,
      classId: r.classId,
      attendanceDate: r.attendanceDate,
      status: r.status,
      markedBy: this.userId(),
      isActive: true,
    }));

    this.attendanceService.bulkSave(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.toast.success('Attendance saved successfully!');
      },
      error: () => {
        this.saving.set(false);
        this.toast.error('Failed to save attendance!');
      },
    });
  }
}
