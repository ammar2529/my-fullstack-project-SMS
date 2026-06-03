import { Component, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ClassService } from '../../core/services/classes/class.service';
import { ToastService } from '../../shared/services/toast.service';
import * as XLSX from 'xlsx';
import { environment } from '../../../environments/environment.development';
@Component({
  selector: 'app-bulk-import',
  imports: [],
  templateUrl: './bulk-import.html',
  styleUrl: './bulk-import.scss',
})
export class BulkImport {
  classes = signal<any[]>([]);
  preview = signal<any[]>([]);
  importing = signal(false);
  result = signal<any>(null);
  dragOver = signal(false);

  constructor(
    private http: HttpClient,
    private classService: ClassService,
    private toast: ToastService,
  ) {
    this.classService.getAll().subscribe({ next: (res) => this.classes.set(res.data) });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) this.readExcel(file);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragOver.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) this.readExcel(file);
  }

  readExcel(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

      if (rows.length < 2) {
        this.toast.error('File is empty or invalid!');
        return;
      }

      // Skip header row
      const students = rows
        .slice(1)
        .map((row, i) => ({
          rowNo: i + 2,
          fullName: row[0] || '',
          email: row[1] || '',
          rollNo: row[2] || '',
          classId: this.findClassId(row[3]),
          fatherName: row[4] || '',
          phoneNo: row[5] || '',
          dob: row[6] ? new Date(row[6]) : new Date(),
          address: row[7] || '',
          className: row[3] || '',
          hasError: !row[0] || !row[1] || !row[2],
        }))
        .filter((s) => s.fullName);

      this.preview.set(students);
      this.result.set(null);
    };
    reader.readAsArrayBuffer(file);
  }

  findClassId(className: string): number {
    if (!className) return 0;
    const cls = this.classes().find(
      (c) => `${c.className} - ${c.section}`.toLowerCase() === className.toLowerCase(),
    );
    return cls?.id || 0;
  }

  downloadTemplate() {
    const headers = [
      'Full Name',
      'Email',
      'Roll No',
      'Class (e.g. Class 1 - A)',
      'Father Name',
      'Phone No',
      'Date of Birth (YYYY-MM-DD)',
      'Address',
    ];
    const sample = [
      'Ahmad Ali',
      'ahmad@school.com',
      'S-001',
      'Class 1 - A',
      'Ali Hassan',
      '0300-1234567',
      '2010-01-15',
      'Lahore',
    ];

    const ws = XLSX.utils.aoa_to_sheet([headers, sample]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.writeFile(wb, 'student_import_template.xlsx');
  }

  importStudents() {
    const validRows = this.preview().filter((s) => s.classId > 0 && !s.hasError);
    if (validRows.length === 0) {
      this.toast.error('No valid rows to import!');
      return;
    }

    this.importing.set(true);
    const payload = validRows.map((s) => ({
      rowNo: s.rowNo,
      fullName: s.fullName,
      email: s.email,
      rollNo: s.rollNo,
      classId: s.classId,
      fatherName: s.fatherName,
      phoneNo: s.phoneNo,
      dob: s.dob,
      address: s.address,
    }));

    this.http.post<any>(`${environment.baseUrl}/BulkImport/students`, payload).subscribe({
      next: (res) => {
        this.importing.set(false);
        this.result.set(res.data);
        this.preview.set([]);
        this.toast.success(`${res.data.imported} students imported!`);
      },
      error: () => {
        this.importing.set(false);
        this.toast.error('Import failed!');
      },
    });
  }

  clearPreview() {
    this.preview.set([]);
    this.result.set(null);
  }
}
