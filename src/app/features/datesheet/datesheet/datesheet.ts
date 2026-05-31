import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatesheetService } from '../../../core/services/datesheet/datesheet.service';
import { ClassService } from '../../../core/services/classes/class.service';
import { SubjectService } from '../../../core/services/subject/subject.service';
import { ExamService } from '../../../core/services/exam/exam.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';


interface DatesheetRow {
  subjectId: number;
  subjectName: string;
  examDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  notes: string;
}

@Component({
  selector: 'app-datesheet',
  imports: [CommonModule, FormsModule],
  templateUrl: './datesheet.html',
  styleUrl: './datesheet.scss',
})
export class Datesheet implements OnInit {
  // List view
  datesheets = signal<any[]>([]);
  loading = signal(false);
  filterClass = signal(0);
  filterExam = signal('');

  // Form
  formVisible = signal(false);
  saving = signal(false);
  formLoading = signal(false);

  // Form fields
  selectedExamTitle = signal('');
  selectedClassId = signal(0);
  examStartDate = signal('');
  examEndDate = signal('');
  rows = signal<DatesheetRow[]>([]);

  // Data
  classes = signal<any[]>([]);
  subjects = signal<any[]>([]);
  exams = signal<any[]>([]);
  userRole = signal('');

  isAdmin = computed(() => this.userRole() === 'Admin');

  // Unique exam titles from exams
  examTitles = computed(() => {
    const titles = [...new Set(this.exams().map((e) => e.examName))];
    return titles;
  });

  // Filtered subjects by selected class
  classSubjects = computed(() => {
    if (!this.selectedClassId()) return [];
    return this.subjects().filter((s) => s.classId === this.selectedClassId());
  });

  // Grouped datesheet for list view
  groupedDatesheets = computed(() => {
    let data = this.datesheets();
    if (this.filterClass()) data = data.filter((d) => d.classId === this.filterClass());
    if (this.filterExam()) data = data.filter((d) => d.examTitle === this.filterExam());

    const groups: { [key: string]: { className: string; items: any[] } } = {};
    data.forEach((d) => {
      const key = `${d.examTitle}__${d.className}`;
      if (!groups[key]) groups[key] = { className: d.className, items: [] };
      groups[key].items.push(d);
    });
    return Object.entries(groups).map(([key, val]) => ({
      examTitle: key.split('__')[0],
      className: val.className,
      classId: val.items[0]?.classId,
      items: val.items.sort(
        (a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime(),
      ),
    }));
  });

  // Print
  printVisible = signal(false);
  printData = signal<any>(null);

  constructor(
    private datesheetService: DatesheetService,
    private classService: ClassService,
    private subjectService: SubjectService,
    private examService: ExamService,
    private authService: AuthService,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.userRole.set(this.authService.getRole());
    this.loadDatesheets();
    this.classService.getAll().subscribe({ next: (res) => this.classes.set(res.data) });
    this.subjectService.getAll().subscribe({ next: (res) => this.subjects.set(res.data) });
    this.examService.getAll().subscribe({ next: (res) => this.exams.set(res.data) });
  }

  loadDatesheets() {
    this.loading.set(true);
    this.datesheetService.getAll().subscribe({
      next: (res) => {
        this.datesheets.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openForm() {
    this.selectedExamTitle.set('');
    this.selectedClassId.set(0);
    this.examStartDate.set('');
    this.examEndDate.set('');
    this.rows.set([]);
    this.formVisible.set(true);
  }

  onClassChange(classId: number) {
    this.selectedClassId.set(classId);
    this.generateRows();
  }

  onExamChange(title: string) {
    this.selectedExamTitle.set(title);
    // Load existing datesheet if any
    if (title && this.selectedClassId()) {
      this.formLoading.set(true);
      this.datesheetService.getByExamAndClass(title, this.selectedClassId()).subscribe({
        next: (res) => {
          if (res.data?.length > 0) {
            // Existing data load karo
            const existingRows = this.classSubjects().map((sub) => {
              const existing = res.data.find((r: any) => r.subjectId === sub.id);
              return {
                subjectId: sub.id,
                subjectName: sub.subjectName,
                examDate: existing ? new Date(existing.examDate).toISOString().split('T')[0] : '',
                startTime: existing?.startTime ?? '09:00',
                endTime: existing?.endTime ?? '11:00',
                venue: existing?.venue ?? '',
                notes: existing?.notes ?? '',
              };
            });
            this.rows.set(existingRows);
          } else {
            this.generateRows();
          }
          this.formLoading.set(false);
        },
        error: () => {
          this.generateRows();
          this.formLoading.set(false);
        },
      });
    }
  }

  generateRows() {
    if (!this.selectedClassId()) return;
    const rows = this.classSubjects().map((sub) => ({
      subjectId: sub.id,
      subjectName: sub.subjectName,
      examDate: this.examStartDate() || '',
      startTime: '09:00',
      endTime: '11:00',
      venue: '',
      notes: '',
    }));
    this.rows.set(rows);
  }

  updateRow(index: number, field: string, value: string) {
    this.rows.update((rows) => {
      const updated = [...rows];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  updateSubject(index: number, subjectId: number) {
    const sub = this.classSubjects().find((s) => s.id === subjectId);
    this.rows.update((rows) => {
      const updated = [...rows];
      updated[index] = {
        ...updated[index],
        subjectId,
        subjectName: sub?.subjectName ?? '',
      };
      return updated;
    });
  }

  saveDatesheet() {
    if (!this.selectedExamTitle() || !this.selectedClassId()) {
      this.toast.warning('Select exam title and class!');
      return;
    }

    const invalidRows = this.rows().filter((r) => !r.examDate || !r.startTime || !r.endTime);
    if (invalidRows.length > 0) {
      this.toast.warning('Please fill date and time for all subjects!');
      return;
    }

    this.saving.set(true);
    const payload = {
      examTitle: this.selectedExamTitle(),
      classId: this.selectedClassId(),
      items: this.rows().map((r) => ({
        subjectId: r.subjectId,
        examDate: r.examDate,
        startTime: r.startTime,
        endTime: r.endTime,
        venue: r.venue,
        notes: r.notes,
      })),
    };

    this.datesheetService.bulkSave(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.formVisible.set(false);
        this.loadDatesheets();
        this.toast.success('Datesheet saved successfully!');
      },
      error: () => {
        this.saving.set(false);
        this.toast.error('Save failed!');
      },
    });
  }

  deleteGroup(examTitle: string, classId: number) {
    if (confirm(`Delete datesheet for ${examTitle}?`)) {
      this.datesheetService.deleteByExam(examTitle, classId).subscribe({
        next: () => {
          this.loadDatesheets();
          this.toast.success('Deleted!');
        },
        error: () => this.toast.error('Delete failed!'),
      });
    }
  }

  openPrint(group: any) {
    this.printData.set(group);
    this.printVisible.set(true);
  }

  printDatesheet() {
    const printContent = document.getElementById('printSection');
    if (!printContent) return;
    const win = window.open('', '_blank', 'width=1000,height=800');
    if (!win) return;

    win.document.write(`
      <html>
        <head>
          <title>Official_Exam_Datesheet</title>
          <style>
            @page { size: A4 portrait; margin: 20mm; }
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 0; color: #2d3748; background: #fff; line-height: 1.4; }
            .print-header { text-align: center; margin-bottom: 30px; border-bottom: 3px double #1e3a5f; padding-bottom: 15px; }
            .print-header h2 { color: #1e3a5f; margin: 0; font-size: 26px; text-transform: uppercase; letter-spacing: 1px; font-weight: 800; }
            .print-header h3 { color: #2d3748; margin: 8px 0 4px; font-size: 18px; font-weight: 600; }
            .print-header p  { color: #4a5568; margin: 0; font-size: 14px; font-weight: 500; }

            table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 40px; }
            th { background: #1e3a5f !important; color: white !important; padding: 12px 14px; text-align: left; font-size: 13px; font-transform: uppercase; font-weight: 600; border: 1px solid #1e3a5f; }
            td { padding: 12px 14px; border: 1px solid #cbd5e1; font-size: 13px; color: #2d3748; }
            tr:nth-child(even) td { background: #f8fafc !important; }
            .fw-bold { font-weight: 700; color: #1e3a5f; }
            .time-slot { font-weight: 600; color: #2b6cb0; }

            .footer { margin-top: 60px; display: flex; justify-content: space-between; padding: 0 20px; }
            .sig-box { display: flex; flex-direction: column; align-items: center; }
            .sig-line { border-top: 1.5px solid #4a5568; width: 200px; text-align: center; padding-top: 8px; font-size: 13px; font-weight: 600; color: #4a5568; }

            /* Print Command Trigger configuration */
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              th { background: #1e3a5f !important; color: white !important; }
              tr:nth-child(even) td { background: #f8fafc !important; }
            }
          </style>
        </head>
        <body>${printContent.innerHTML}</body>
      </html>
    `);

    win.document.close();
    setTimeout(() => {
      win.print();
      win.close();
    }, 500);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-PK', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  getDayName(date: string): string {
    return new Date(date).toLocaleDateString('en-PK', { weekday: 'long' });
  }

  getClassName(classId: number): string {
    const c = this.classes().find((cl) => cl.id === classId);
    return c ? `${c.className} - ${c.section}` : '';
  }
}
