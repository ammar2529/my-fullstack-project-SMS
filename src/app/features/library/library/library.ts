import { Component, computed, signal } from '@angular/core';
import { BookIssueModel, BookModel } from '../../../core/models/library.model';
import { ReusableTable, TableColumn } from '../../../shared/components/table/reusable-table/reusable-table';
import { LibraryService } from '../../../core/services/library/library.service';
import { StudentService } from '../../../core/services/student.service';
import { ToastService } from '../../../shared/services/toast.service';
import { FormField as FF, ReusableForm } from '../../../shared/components/form/reusable-form/reusable-form';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-library',
  imports: [ReusableTable, DatePipe, ReusableForm],
  templateUrl: './library.html',
  styleUrl: './library.scss',
})
export class Library {
  activeTab = signal<'books' | 'issues'>('books');

  // Books
  books = signal<BookModel[]>([]);
  booksLoading = signal(false);
  bookForm = signal(false);
  bookSaving = signal(false);
  bookEdit = signal<any>({});
  isBookEdit = signal(false);

  // Issues
  issues = signal<BookIssueModel[]>([]);
  issuesLoading = signal(false);
  issueForm = signal(false);
  issueSaving = signal(false);
  students = signal<any[]>([]);

  // Issue form fields
  issueBookId = signal(0);
  issueStudentId = signal(0);
  issueDueDays = signal(14);

  // Stats
  totalBooks = computed(() => this.books().length);
  totalIssued = computed(() => this.issues().filter((i) => i.status === 'Issued').length);
  totalOverdue = computed(() => this.issues().filter((i) => i.isOverdue).length);
  totalReturned = computed(() => this.issues().filter((i) => i.status === 'Returned').length);

  bookColumns: TableColumn[] = [
    { key: 'title', label: 'Title' },
    { key: 'author', label: 'Author' },
    { key: 'isbn', label: 'ISBN' },
    { key: 'totalCopies', label: 'Total' },
    { key: 'available', label: 'Available' },
    { key: 'issuedCopies', label: 'Issued' },
  ];

  issueColumns: TableColumn[] = [
    { key: 'rollNo', label: 'Roll No' },
    { key: 'studentName', label: 'Student' },
    { key: 'bookTitle', label: 'Book' },
    { key: 'issueDate', label: 'Issued' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'status', label: 'Status' },
    { key: 'fine', label: 'Fine' },
  ];

  bookFormFields: FF[] = [
    { key: 'title', label: 'Book Title', type: 'text', required: true },
    { key: 'author', label: 'Author', type: 'text', required: true },
    { key: 'isbn', label: 'ISBN', type: 'text', required: false },
    { key: 'totalCopies', label: 'Total Copies', type: 'number', required: true },
  ];

  get availableBooks() {
    return this.books().filter((b) => b.available > 0);
  }

  constructor(
    private libraryService: LibraryService,
    private studentService: StudentService,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.loadBooks();
    this.loadIssues();
    this.studentService.getAll().subscribe({
      next: (res) => this.students.set(res.data),
    });
  }

  // Books
  loadBooks() {
    this.booksLoading.set(true);
    this.libraryService.getBooks().subscribe({
      next: (res) => {
        this.books.set(res.data);
        this.booksLoading.set(false);
      },
      error: () => this.booksLoading.set(false),
    });
  }

  openAddBook() {
    this.isBookEdit.set(false);
    this.bookEdit.set({});
    this.bookForm.set(true);
  }

  openEditBook(b: BookModel) {
    this.isBookEdit.set(true);
    this.bookEdit.set({ ...b });
    this.bookForm.set(true);
  }

  onDeleteBook(b: BookModel) {
    if (confirm(`Delete "${b.title}"?`)) {
      this.libraryService.deleteBook(b.id).subscribe({
        next: () => {
          this.loadBooks();
          this.toast.success('Book deleted!');
        },
        error: () => this.toast.error('Delete failed!'),
      });
    }
  }

  onSaveBook(data: any) {
    this.bookSaving.set(true);
    const call = this.isBookEdit()
      ? this.libraryService.updateBook(data.id, data)
      : this.libraryService.createBook(data);
    call.subscribe({
      next: () => {
        this.bookSaving.set(false);
        this.bookForm.set(false);
        this.loadBooks();
        this.toast.success(this.isBookEdit() ? 'Book updated!' : 'Book added!');
      },
      error: () => {
        this.bookSaving.set(false);
        this.toast.error('Error!');
      },
    });
  }

  // Issues
  loadIssues() {
    this.issuesLoading.set(true);
    this.libraryService.getIssues().subscribe({
      next: (res) => {
        this.issues.set(res.data);
        this.issuesLoading.set(false);
      },
      error: () => this.issuesLoading.set(false),
    });
  }

  openIssueForm() {
    this.issueBookId.set(0);
    this.issueStudentId.set(0);
    this.issueDueDays.set(14);
    this.issueForm.set(true);
  }

  onIssueBook() {
    if (!this.issueBookId() || !this.issueStudentId()) {
      this.toast.warning('Please select book and student!');
      return;
    }
    this.issueSaving.set(true);
    this.libraryService
      .issueBook({
        bookId: this.issueBookId(),
        studentId: this.issueStudentId(),
        dueDays: this.issueDueDays(),
      })
      .subscribe({
        next: () => {
          this.issueSaving.set(false);
          this.issueForm.set(false);
          this.loadBooks();
          this.loadIssues();
          this.toast.success('Book issued successfully!');
        },
        error: (err) => {
          this.issueSaving.set(false);
          this.toast.error('Issue failed!');
        },
      });
  }

  onReturnBook(issue: BookIssueModel) {
    if (issue.status === 'Returned') {
      this.toast.info('Already returned!');
      return;
    }
    if (confirm(`Return "${issue.bookTitle}" from ${issue.studentName}?`)) {
      this.libraryService.returnBook(issue.id).subscribe({
        next: (res) => {
          this.loadBooks();
          this.loadIssues();
          const msg =
            res.data?.fine > 0
              ? `Returned! Fine: Rs ${res.data.fine}`
              : 'Book returned successfully!';
          this.toast.success(msg);
        },
        error: () => this.toast.error('Return failed!'),
      });
    }
  }
}
