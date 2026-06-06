import { Component, computed, input, output, signal } from '@angular/core';
import { SearchBar } from '../../search-bar/search-bar';
import { RoleConfig } from '../../role-config/role-config';
import { environment } from '../../../../../environments/environment.development';

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
  apiBaseUrl = environment.baseUrl.replace('/api', '');
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

  isImagePath(key: string): boolean {
    return key.toLowerCase().includes('picture') || key.toLowerCase().includes('image');
  }
  canShowSave(): boolean {
    return RoleConfig[this.roleId()]?.canSave ?? false;
  }

  getStudentImageUrl(imagePath: string | null | undefined): string {
    if (!imagePath) {
      return 'images/default-avatar.png';
    }

    // 1. Agar imagePath ke andar pehle se poora URL majood ho
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // 2. Agar path ke shuru mein double slash ya repeat ho raha ho to saaf karein
    let cleanPath = imagePath;
    if (cleanPath.includes('/uploads/students//uploads/students/')) {
      cleanPath = cleanPath.replace('/uploads/students//uploads/students/', '/uploads/students/');
    }

    // 3. Final unique path return karein
    return this.apiBaseUrl + cleanPath;
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

  protected readonly environment = environment;
}
