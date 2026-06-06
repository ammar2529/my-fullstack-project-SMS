import { Component, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../shared/services/toast.service';
import { environment } from '../../../../environments/environment.development';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-my-fee',
  imports: [DecimalPipe, DatePipe],
  templateUrl: './my-fee.html',
  styleUrl: './my-fee.scss',
})
export class MyFee {
  history = signal<any[]>([]);
  loading = signal(false);
  summary = signal<any>(null);

  receiptData = signal<any>(null);
  receiptVisible = signal(false);

  constructor(
    private http: HttpClient,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.loading.set(true);
    const userId = Number(localStorage.getItem('userId'));
    const roleId = Number(localStorage.getItem('roleId'));

    this.http.get<any>(`${environment.baseUrl}/FeePayments/student-history/${roleId}`).subscribe({
      next: (res) => {
        this.history.set(res.data);

        // Summary calculate karo
        const total = res.data.reduce((s: number, p: any) => s + p.amountPaid, 0);
        const paid = res.data.filter((p: any) => p.status === 'Paid').length;
        const pending = res.data.filter((p: any) => p.status === 'Pending').length;
        this.summary.set({ total, paid, pending, count: res.data.length });

        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  viewReceipt(paymentId: number) {
    this.http.get<any>(`${environment.baseUrl}/FeePayments/receipt/${paymentId}`).subscribe({
      next: (res) => {
        this.receiptData.set(res.data);
        this.receiptVisible.set(true);
      },
      error: () => this.toast.error('Receipt load failed!'),
    });
  }

  printReceipt() {
    const content = document.getElementById('myReceiptSection');
    if (!content) return;
    const win = window.open('', '_blank', 'width=600,height=700');
    if (!win) return;
    win.document.write(`
      <html><head><title>Fee Receipt</title>
      <style>
        body { font-family: Arial; padding: 20px; font-size: 13px; }
        .receipt-header { text-align: center; border-bottom: 2px solid #1e3a5f; padding-bottom: 12px; margin-bottom: 14px; }
        .receipt-header h2 { color: #1e3a5f; }
        .receipt-no { background: #1e3a5f; color: #fff; text-align: center; padding: 8px; border-radius: 6px; margin: 10px 0; font-weight: bold; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 10px 0; }
        .info-item { border: 1px solid #eee; padding: 8px; border-radius: 6px; }
        .info-label { font-size: 10px; color: #888; text-transform: uppercase; }
        .info-value { font-weight: 600; color: #333; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th { background: #1e3a5f; color: #fff; padding: 8px; }
        td { padding: 8px; border-bottom: 1px solid #eee; }
        .footer { display: flex; justify-content: space-between; margin-top: 20px; }
        .sig { border-top: 1px solid #333; width: 140px; text-align: center; padding-top: 6px; font-size: 11px; color: #666; }
      </style></head>
      <body>${content.innerHTML}
      <div class="footer">
        <div class="sig">Received By</div>
        <div class="sig">Principal</div>
      </div>
      </body></html>
    `);
    win.document.close();
    setTimeout(() => {
      win.print();
      win.close();
    }, 500);
  }

  getStatusClass(status: string): string {
    const map: any = { Paid: 'status-paid', Pending: 'status-pending', Unpaid: 'status-unpaid' };
    return map[status] || '';
  }
}
