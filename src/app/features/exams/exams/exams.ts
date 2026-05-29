import { Component, computed, signal } from '@angular/core';
import { ExamModel } from '../../../core/models/exam.model';
import { ReusableTable, TableColumn } from '../../../shared/components/table/reusable-table/reusable-table';
import { ExamService } from '../../../core/services/exam/exam.service';
import { ClassService } from '../../../core/services/classes/class.service';
import { ToastService } from '../../../shared/services/toast.service';
import {
  ReusableForm,
  FormField as FF,
} from '../../../shared/components/form/reusable-form/reusable-form';
@Component({
  selector: 'app-exams',
  imports: [ReusableTable, ReusableForm],
  templateUrl: './exams.html',
  styleUrl: './exams.scss',
})
export class Exams {
  // Tab
  activeTab = signal<'exams' | 'results'>('exams');

  // Exams
  exams = signal<ExamModel[]>([]);
  loading = signal(false);
  formVisible = signal(false);
  formLoading = signal(false);
  editModel = signal<any>({});
  isEdit = signal(false);
  classes = signal<any[]>([]);

  // Enter Results
  enterVisible = signal(false);
  enterLoading = signal(false);
  enterSaving = signal(false);
  selectedExam = signal<any>(null);
  selectedClassId = signal(0);
  students = signal<any[]>([]);
  subjects = signal<any[]>([]);
  resultsGrid = signal<any[]>([]);
  studentSearch = signal('');

  filteredStudents = computed(() => {
    const q = this.studentSearch().toLowerCase();
    if (!q) return this.resultsGrid();
    return this.resultsGrid().filter(
      (r) => r.fullName.toLowerCase().includes(q) || r.rollNo.toLowerCase().includes(q),
    );
  });

  // Results List
  resultsList = signal<any[]>([]);
  resultsListLoading = signal(false);
  filterExamId = signal(0);
  filterClassId = signal(0);
  filterSearch = signal('');

  filteredResults = computed(() => {
    let data = this.resultsList();
    if (this.filterExamId()) data = data.filter((r) => r.examId === this.filterExamId());
    if (this.filterClassId()) data = data.filter((r) => r.classId === this.filterClassId());
    const q = this.filterSearch().toLowerCase();
    if (q)
      data = data.filter(
        (r) =>
          r.studentName.toLowerCase().includes(q) ||
          r.rollNo.toLowerCase().includes(q) ||
          r.subjectName.toLowerCase().includes(q) ||
          r.grade.toLowerCase().includes(q),
      );
    return data;
  });

  // Report Card
  reportVisible = signal(false);
  reportData = signal<any>(null);
  reportLoading = signal(false);

  columns: TableColumn[] = [
    { key: 'examName', label: 'Exam Name' },
    { key: 'className', label: 'Class' },
    { key: 'examDate', label: 'Date' },
    { key: 'totalMarks', label: 'Total Marks' },
  ];

  resultsColumns: TableColumn[] = [
    { key: 'rollNo', label: 'Roll No' },
    { key: 'studentName', label: 'Student' },
    { key: 'className', label: 'Class' },
    { key: 'examName', label: 'Exam' },
    { key: 'subjectName', label: 'Subject' },
    { key: 'obtainedMarks', label: 'Obtained' },
    { key: 'totalMarks', label: 'Total' },
    { key: 'grade', label: 'Grade' },
  ];

  get formFields(): FF[] {
    return [
      { key: 'examName', label: 'Exam Name', type: 'text', required: true },
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
      { key: 'examDate', label: 'Exam Date', type: 'date', required: true },
      { key: 'totalMarks', label: 'Total Marks', type: 'number', required: true },
    ];
  }

  constructor(
    private examService: ExamService,
    private classService: ClassService,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.loadExams();
    this.classService.getAll().subscribe({ next: (res) => this.classes.set(res.data) });
  }

  loadExams() {
    this.loading.set(true);
    this.examService.getAll().subscribe({
      next: (res) => {
        this.exams.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  switchTab(tab: 'exams' | 'results') {
    this.activeTab.set(tab);
    if (tab === 'results' && this.resultsList().length === 0) {
      this.loadResultsList();
    }
  }

  loadResultsList() {
    this.resultsListLoading.set(true);
    this.examService.getResultsList().subscribe({
      next: (res) => {
        this.resultsList.set(res.data);
        this.resultsListLoading.set(false);
      },
      error: () => this.resultsListLoading.set(false),
    });
  }

  openAdd() {
    this.isEdit.set(false);
    this.editModel.set({});
    this.formVisible.set(true);
  }

  openEdit(e: ExamModel) {
    this.isEdit.set(true);
    this.editModel.set({ ...e });
    this.formVisible.set(true);
  }

  onDelete(e: ExamModel) {
    if (confirm(`Delete ${e.examName}?`)) {
      this.examService.delete(e.id).subscribe({
        next: () => {
          this.loadExams();
          this.toast.success('Exam deleted!');
        },
        error: () => this.toast.error('Delete failed!'),
      });
    }
  }

  onSave(data: any) {
    this.formLoading.set(true);

    // --- Payload Sanitization ---
    const preparedData = {
      ...data,
      // Agar data.marksType mein NaN aa raha hai to use string format mein convert karein
      marksType:
        isNaN(data.marksType) && typeof data.marksType !== 'string'
          ? this.editModel()?.marksType || 'Same'
          : String(data.marksType),
    };

    // API Call ab preparedData ke sath hogi
    const call = this.isEdit()
      ? this.examService.update(preparedData.id, preparedData)
      : this.examService.create(preparedData);

    call.subscribe({
      next: () => {
        this.formLoading.set(false);
        this.formVisible.set(false);
        this.loadExams();
        this.toast.success(this.isEdit() ? 'Exam updated!' : 'Exam added!');
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

  // Enter Results
  openEnterResults(exam: ExamModel) {
    this.selectedExam.set(exam);
    this.selectedClassId.set((exam as any).classId);
    this.enterVisible.set(true);
    this.loadResultsGrid((exam as any).classId);
  }

  loadResultsGrid(classId: number) {
    if (!classId) return;
    this.enterLoading.set(true);
    this.selectedClassId.set(classId);
    this.examService.getByExamAndClass(this.selectedExam().id, classId).subscribe({
      next: (res) => {
        const data = res.data;
        this.students.set(data.students);
        this.subjects.set(data.subjects);
        const grid = data.students.map((s: any) => {
          const row: any = { studentId: s.id, rollNo: s.rollNo, fullName: s.fullName };
          data.subjects.forEach((sub: any) => {
            const ex = data.results.find(
              (r: any) => r.studentId === s.id && r.subjectId === sub.id,
            );
            row[`sub_${sub.id}`] = ex?.obtainedMarks ?? '';
          });
          return row;
        });
        this.resultsGrid.set(grid);
        this.enterLoading.set(false);
      },
      error: () => this.enterLoading.set(false),
    });
  }

  updateMark(studentId: number, subjectId: number, value: string) {
    this.resultsGrid.update((grid) =>
      grid.map((r) => (r.studentId === studentId ? { ...r, [`sub_${subjectId}`]: value } : r)),
    );
  }

  saveResults() {
    this.enterSaving.set(true);
    const payload: any[] = [];
    this.resultsGrid().forEach((row) => {
      this.subjects().forEach((sub: any) => {
        payload.push({
          examId: this.selectedExam().id,
          studentId: row.studentId,
          subjectId: sub.id,
          obtainedMarks: Number(row[`sub_${sub.id}`] || 0),
          isActive: true,
        });
      });
    });
    this.examService.bulkSaveResults(payload).subscribe({
      next: () => {
        this.enterSaving.set(false);
        this.toast.success('Results saved!');
      },
      error: () => {
        this.enterSaving.set(false);
        this.toast.error('Save failed!');
      },
    });
  }

  closeEnter() {
    this.enterVisible.set(false);
  }

  // Report Card
  viewReportCard(row: any) {
    this.reportVisible.set(true);
    this.reportLoading.set(true);
    this.examService.getReportCard(row.studentId, row.examId).subscribe({
      next: (res) => {
        this.reportData.set(res.data);
        this.reportLoading.set(false);
      },
      error: () => this.reportLoading.set(false),
    });
  }

  closeReport() {
    this.reportVisible.set(false);
  }

  printReport() {
    const printContent = document.getElementById('reportCard');
    if (!printContent) return;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
    <html>
      <head>
        <title>Result Card</title>
        <link rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
        <link rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .no-print { display: none !important; }
          .report-header {
            background: #1e3a5f !important;
            color: white !important;
            padding: 20px 24px;
            display: flex;
            align-items: center;
            gap: 14px;
            border-radius: 8px 8px 0 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .report-header h4 { margin: 0; color: white; font-weight: 700; }
          .report-header p  { margin: 0; opacity: 0.7; font-size: 0.85rem; }
          .report-header i  { font-size: 2.5rem; color: #4fc3f7; }
          .report-body { padding: 24px; }
          .student-info-card {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 16px 20px;
            margin-bottom: 20px;
          }
          .info-row {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .info-item { display: flex; flex-direction: column; gap: 2px; }
          .label { font-size: 0.75rem; color: #888; text-transform: uppercase; }
          .value { font-weight: 600; color: #333; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th {
            background: #1e3a5f !important;
            color: white !important;
            padding: 10px 12px;
            font-size: 0.82rem;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          td { padding: 10px 12px; border-bottom: 1px solid #f0f2f5; font-size: 0.88rem; }
          tfoot td { background: #f8f9fa; font-weight: bold; border-top: 2px solid #1e3a5f; }
          .grade-badge {
            padding: 3px 10px;
            border-radius: 20px;
            font-size: 0.82rem;
            font-weight: 700;
          }
          .summary-cards {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }
          .sum-card {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 16px;
            text-align: center;
          }
          .sum-label { font-size: 0.78rem; color: #888; text-transform: uppercase; display: block; }
          .sum-value { font-size: 1.4rem; font-weight: 700; color: #1e3a5f; display: block; }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
    </html>
  `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  }

  getGradeColor(grade: string): string {
    const colors: any = {
      'A+': '#27ae60',
      A: '#2ecc71',
      B: '#2980b9',
      C: '#f39c12',
      D: '#e67e22',
      F: '#e74c3c',
    };
    return colors[grade] || '#888';
  }

  getRowTotal(row: any): number {
    return this.subjects().reduce((sum: number, sub: any) => {
      return sum + (Number(row[`sub_${sub.id}`]) || 0);
    }, 0);
  }

  getRowTotalMax(): number {
    debugger;
    return this.subjects().reduce((sum: number, sub: any) => {
      return sum + (Number(sub.totalMarks) || 0);
    }, 0);
  }
}
