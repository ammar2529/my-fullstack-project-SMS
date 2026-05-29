import { Component, computed, input, output, signal } from '@angular/core';
import { SearchBar } from '../../search-bar/search-bar';

export interface TableColumn {
  key: string;
  label: string;
  pipe?: 'date' | 'currency' | 'uppercase';
}
@Component({
  selector: 'app-reusable-table',
  imports: [SearchBar],
  templateUrl: './reusable-table.html',
  styleUrl: './reusable-table.scss',
})
export class ReusableTable {
  columns = input<TableColumn[]>([]);
  data = input<any[]>([]);
  loading = input(false);
  showEdit = input(true);
  showDelete = input(true);
  searchable = input(true);
  onEdit = output<any>();
  onDelete = output<any>();
  showAssign = input(false);
  onAssign = output<any>();

  searchQuery = signal('');

  filteredData = computed(() => {
    debugger
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.data();
    return this.data().filter((row) =>
      this.columns().some((col) => {
        const val = this.getValue(row, col.key);
        return String(val ?? '')
          .toLowerCase()
          .includes(q);
      }),
    );
  });
  getValue(row: any, key: string): any {
    return key.split('.').reduce((obj, k) => obj?.[k], row);
  }
  isArray(val: any): boolean {
    return Array.isArray(val);
  }
}
