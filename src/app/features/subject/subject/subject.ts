import { Component, signal } from '@angular/core';
import { SubjectModel } from '../../../core/models/subject.model';
import { ReusableTable, TableColumn } from '../../../shared/components/table/reusable-table/reusable-table';
import {
  FormField as FF,
  ReusableForm,
} from '../../../shared/components/form/reusable-form/reusable-form';
import { SubjectService } from '../../../core/services/subject/subject.service';
import { ClassService } from '../../../core/services/classes/class.service';
@Component({
  selector: 'app-subject',
  imports: [ReusableTable, ReusableForm],
  templateUrl: './subject.html',
  styleUrl: './subject.scss',
})
export class Subject {
  subjects = signal<SubjectModel[]>([]);
  loading = signal(false);
  formVisible = signal(false);
  formLoading = signal(false);
  editModel = signal<any>({});
  isEdit = signal(false);
  classes = signal<any[]>([]);

  columns: TableColumn[] = [
    { key: 'subjectName', label: 'Subject Name' },
    { key: 'className', label: 'Class' },
  ];

  get formFields(): FF[] {
    return [
      { key: 'subjectName', label: 'Subject Name', type: 'text', required: true },
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
        key: 'totalMarks',
        label: 'Total Marks',
        type: 'number',
        required: true,
        placeholder: 'e.g. 100',
      },
    ];
  }

  constructor(
    private subjectService: SubjectService,
    private classService: ClassService,
  ) {}

  ngOnInit() {
    this.loadSubjects();
    this.loadClasses();
  }

  loadSubjects() {
    this.loading.set(true);
    this.subjectService.getAll().subscribe({
      next: (res) => {
        this.subjects.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  loadClasses() {
    this.classService.getAll().subscribe({
      next: (res) => this.classes.set(res.data),
    });
  }

  openAdd() {
    this.isEdit.set(false);
    this.editModel.set({});
    this.formVisible.set(true);
  }

  openEdit(s: SubjectModel) {
    this.isEdit.set(true);
    this.editModel.set({ ...s });
    this.formVisible.set(true);
  }

  onDelete(s: SubjectModel) {
    if (confirm(`Delete ${s.subjectName}?`)) {
      this.subjectService.delete(s.id).subscribe({ next: () => this.loadSubjects() });
    }
  }

  onSave(data: any) {
    this.formLoading.set(true);
    const call = this.isEdit()
      ? this.subjectService.update(data.id, data)
      : this.subjectService.create(data);
    call.subscribe({
      next: () => {
        this.formLoading.set(false);
        this.formVisible.set(false);
        this.loadSubjects();
      },
      error: () => this.formLoading.set(false),
    });
  }

  onCancel() {
    this.formVisible.set(false);
  }
}
