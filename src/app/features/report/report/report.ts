import { Component, signal } from '@angular/core';
import { ReportService } from '../../../core/services/report/report.service';
import { ClassService } from '../../../core/services/classes/class.service';
import { ExamService } from '../../../core/services/exam/exam.service';
import { ToastService } from '../../../shared/services/toast.service';
import { DatePipe } from '@angular/common';
import { ClasslabelPipe } from '../../../shared/pipes/classlabel-pipe';

@Component({
  selector: 'app-report',
  imports: [DatePipe, ClasslabelPipe],
  templateUrl: './report.html',
  styleUrl: './report.scss',
})
export class Report {
  activeTab = signal<'students' | 'attendance' | 'results'>('students');

  classes = signal<any[]>([]);
  exams = signal<any[]>([]);
  loading = signal(false);

  // Students Report
  studentData = signal<any[]>([]);
  studentClassId = signal(0);
  studentSearch = signal('');

  // Attendance Report
  attData = signal<any>(null);
  attClassId = signal(0);
  attFromDate = signal(new Date(new Date().setDate(1)).toISOString().split('T')[0]);
  attToDate = signal(new Date().toISOString().split('T')[0]);
  attView = signal<'summary' | 'detail'>('summary');

  // Results Report
  resultData = signal<any>(null);
  resultExamId = signal(0);
  resultClassId = signal(0);
  resultView = signal<'summary' | 'detail'>('summary');
  today = new Date();
  constructor(
    private reportService: ReportService,
    private classService: ClassService,
    private examService: ExamService,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.classService.getAll().subscribe({ next: (res) => this.classes.set(res.data) });
    this.examService.getAll().subscribe({ next: (res) => this.exams.set(res.data) });
    this.loadStudentReport();
  }

  // Students
  loadStudentReport() {
    this.loading.set(true);
    this.reportService
      .getStudentReport(this.studentClassId() || undefined, this.studentSearch() || undefined)
      .subscribe({
        next: (res) => {
          this.studentData.set(res.data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  // Attendance
  loadAttendanceReport() {
    this.loading.set(true);
    this.reportService
      .getAttendanceReport(this.attClassId() || undefined, this.attFromDate(), this.attToDate())
      .subscribe({
        next: (res) => {
          this.attData.set(res.data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  // Results
  loadResultsReport() {
    this.loading.set(true);
    this.reportService
      .getResultsReport(this.resultExamId() || undefined, this.resultClassId() || undefined)
      .subscribe({
        next: (res) => {
          this.resultData.set(res.data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  // Print
  printReport(sectionId: string, title: string) {
    const content = document.getElementById(sectionId);
    if (!content) return;

    const win = window.open('', '_blank', 'width=1000,height=700');
    if (!win) return;

    win.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: Arial, sans-serif; padding: 20px; font-size: 13px; }
            .print-header { text-align: center; margin-bottom: 16px; border-bottom: 2px solid #1e3a5f; padding-bottom: 12px; }
            .print-header h2 { color: #1e3a5f; font-size: 18px; }
            .print-header p  { color: #666; font-size: 12px; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            th { background: #1e3a5f; color: #fff; padding: 8px 10px; text-align: left; font-size: 12px; }
            td { padding: 7px 10px; border-bottom: 1px solid #eee; font-size: 12px; }
            tr:nth-child(even) td { background: #f8f9fa; }
            .grade-a  { color: #27ae60; font-weight: bold; }
            .grade-b  { color: #2980b9; font-weight: bold; }
            .grade-c  { color: #f39c12; font-weight: bold; }
            .grade-f  { color: #e74c3c; font-weight: bold; }
            .present  { color: #27ae60; }
            .absent   { color: #e74c3c; }
            .leave    { color: #f39c12; }
            .footer { margin-top: 30px; display: flex; justify-content: space-between; }
            .sig { border-top: 1px solid #333; width: 150px; text-align: center; padding-top: 6px; font-size: 11px; color: #666; }
            @media print { body { padding: 10px; } }
          </style>
        </head>
        <body>
          ${content.innerHTML}
          <div class="footer">
            <div class="sig">Prepared By</div>
            <div class="sig">Principal</div>
          </div>
        </body>
      </html>
    `);
    win.document.close();
    setTimeout(() => {
      win.print();
      win.close();
    }, 500);
  }

  getGradeClass(grade: string): string {
    if (['A+', 'A'].includes(grade)) return 'grade-a';
    if (grade === 'B') return 'grade-b';
    if (grade === 'C') return 'grade-c';
    if (grade === 'F') return 'grade-f';
    return '';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-PK', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
}
