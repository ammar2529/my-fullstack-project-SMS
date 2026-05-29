export interface BookModel {
  id: number;
  title: string;
  author: string;
  isbn: string;
  totalCopies: number;
  available: number;
  issuedCopies: number;
  isActive: boolean;
}

export interface BookIssueModel {
  id: number;
  bookId: number;
  bookTitle: string;
  studentId: number;
  studentName: string;
  rollNo: string;
  issueDate: string;
  dueDate: string;
  returnDate: string | null;
  fine: number;
  status: string;
  isOverdue: boolean;
}
