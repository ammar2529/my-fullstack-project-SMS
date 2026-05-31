import { Component, computed, input, output, signal } from '@angular/core';
import { SearchBar } from '../../search-bar/search-bar';
import { RoleConfig } from '../../role-config/role-config';

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
  roleId = input<number>(0);

  searchQuery = signal('');

  filteredData = computed(() => {
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

  canShowSave(): boolean {
    return RoleConfig[this.roleId()]?.canSave ?? false;
  }

  canShowCancel(): boolean {
    return RoleConfig[this.roleId()]?.canCancel ?? false;
  }

  canShowDelete(): boolean {
    return RoleConfig[this.roleId()]?.canDelete ?? false;
  }

  canShowAssign(): boolean {
    return RoleConfig[this.roleId()]?.canAssign ?? false;
  }
}
