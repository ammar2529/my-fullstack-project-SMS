import { Component, computed, signal } from '@angular/core';
import { StudentService } from '../../../core/services/student.service';
import { ToastService } from '../../../shared/services/toast.service';
import { FeeService } from '../../../core/services/fee/fee.service';
import { FeePaymentService } from '../../../core/services/fee/fee-payment.service';
import { TableColumn } from '../../../shared/components/table/reusable-table/reusable-table';
import { FormField } from '../../../shared/components/form/reusable-form/reusable-form';
import { ClassService } from '../../../core/services/classes/class.service';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-fee-payment',
  imports: [FormsModule, CurrencyPipe, DecimalPipe],
  templateUrl: './fee-payment.html',
  styleUrl: './fee-payment.scss',
})
export class FeePayment {
  classes = signal<any[]>([]);
  selectedClassId = signal<string>('');
  selectedMonth = signal<string>('');

  // Data grid state
  rows = signal<any[]>([]);
  loading = signal(false);
  saving = signal(false);
  classBaseFee = signal<number>(0);

  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Angular Signals reactive dashboard metrics
  totalStudents = computed(() => this.rows().length);
  paidCount = computed(() => this.rows().filter((r: any) => r.status === 'Paid').length);
  pendingCount = computed(() => this.rows().filter((r: any) => r.status === 'Pending').length);
  unpaidCount = computed(
    () => this.rows().filter((r: any) => r.status === 'Unpaid' || !r.status).length,
  );
  totalCollected = computed(() =>
    this.rows().reduce((sum: number, r: any) => sum + (Number(r.amountPaid) || 0), 0),
  );

  constructor(
    private classService: ClassService,
    private feePaymentService: FeePaymentService,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.loadClasses();
    // Auto-select current calendar month on initialization
    const currentMonthIndex = new Date().getMonth();
    this.selectedMonth.set(this.months[currentMonthIndex]);
  }

  loadClasses() {
    this.classService.getAll().subscribe({
      next: (res: any) => this.classes.set(res.data),
      error: () => this.toast.error('Failed to load classes configuration.'),
    });
  }

  /**
   * Triggers automatic data sheet generation when filter parameters change.
   * Resets active metrics instantly to keep the dashboard accurately synchronized.
   */
  onFilterChange(type: 'class' | 'month', value: string) {
    if (type === 'class') {
      this.selectedClassId.set(value);
    } else {
      this.selectedMonth.set(value);
    }

    // Instantly wipe row records to reset dashboard cards to 0 during loading phase
    this.rows.set([]);

    // Only fire API request automatically if both dropdown values are completely selected
    if (this.selectedClassId() && this.selectedMonth()) {
      this.searchClassFees();
    }
  }

  searchClassFees() {
    this.loading.set(true);
    this.feePaymentService
      .getBulkFeeStatus(this.selectedClassId(), this.selectedMonth())
      .subscribe({
        next: (res: any) => {
          this.rows.set(res.data);
          this.classBaseFee.set(res.classFee);
          this.loading.set(false);
        },
        error: (err: any) => {
          this.rows.set([]);
          this.loading.set(false);
          this.toast.error(err.error?.message || 'Failed to fetch fee sheet validation details.');
        },
      });
  }

  /**
   * Fast action modification macro to mass edit state values across the array.
   */
  markAll(actionType: 'Paid' | 'Unpaid') {
    const updatedRows = this.rows().map((row: any) => {
      const amount = actionType === 'Paid' ? row.totalAmount : 0;
      return {
        ...row,
        amountPaid: amount,
        status: actionType,
      };
    });
    this.rows.set(updatedRows);
  }

  /**
   * Dynamically evaluates payment status categories on manual amount input changes
   * and strictly restricts input from exceeding the base total amount.
   */
  onAmountChange(row: any, event: any) {
    let val = Number(event.target.value) || 0;

    // Strict enforcement: Prevent input from exceeding the allowed Base Fee
    if (val > row.totalAmount) {
      this.toast.warning(`Amount cannot exceed the Base Fee of ${row.totalAmount} PKR.`);
      val = row.totalAmount;
      event.target.value = row.totalAmount; // UI input element value manual correction
    }

    // Negative values handler
    if (val < 0) {
      val = 0;
      event.target.value = 0;
    }

    row.amountPaid = val;

    // Synchronize statuses accurately
    if (val >= row.totalAmount) {
      row.status = 'Paid';
    } else if (val > 0 && val < row.totalAmount) {
      row.status = 'Pending';
    } else {
      row.status = 'Unpaid';
    }

    // Force array update to let computed signals re-evaluate immediately
    this.rows.set([...this.rows()]);
  }

  saveBulkFees() {
    this.saving.set(true);
    const payload = this.rows().map((r: any) => ({
      paymentId: r.paymentId,
      studentId: r.studentId,
      feeStructureId: r.feeStructureId,
      totalAmount: r.totalAmount,
      amountPaid: r.amountPaid,
      month: this.selectedMonth(),
      paymentMethod: r.paymentMethod || 'Cash',
      remarks: r.remarks,
    }));

    this.feePaymentService.saveBulkFees(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.toast.success('Fee records synchronized successfully.');
        this.searchClassFees(); // Refresh current sheet layout
      },
      error: () => {
        this.saving.set(false);
        this.toast.error('Network transaction failed. Unable to sync data changes.');
      },
    });
  }
}
