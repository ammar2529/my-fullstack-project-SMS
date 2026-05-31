import { Component, effect, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoleConfig } from '../../role-config/role-config';


export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'date' | 'select' | 'textarea' | 'password' | 'time';
  required?: boolean;
  options?: { label: string; value: any }[];
  placeholder?: string;
}

@Component({
  selector: 'app-reusable-form',
  imports: [FormsModule],
  templateUrl: './reusable-form.html',
  styleUrl: './reusable-form.scss',
})
export class ReusableForm {
  title = input('Form');
  fields = input<FormField[]>([]);
  model = input<any>({});
  loading = input(false);
  visible = input(false);
  roleId = input<number>(0);
  onSave = output<any>();
  onCancel = output<void>();

  formData: any = {};

  constructor() {
    // effect use karo — signal change hone par formData update hoga
    effect(() => {
      const m = this.model();
      this.formData = { ...m };
    });
  }

  // save() {
  //   // Select fields ko number mein convert karo
  //   const processedData = { ...this.formData };
  //   this.fields().forEach((field) => {
  //     if (field.type === 'select' && processedData[field.key] !== undefined) {
  //       processedData[field.key] = Number(processedData[field.key]);
  //     }
  //   });
  //   this.onSave.emit(processedData);
  // }

  save() {
    const processedData = { ...this.formData };
    this.fields().forEach((field) => {
      if (field.type === 'select' && processedData[field.key] !== undefined) {
        const val = processedData[field.key];
        // Agar value number hai to number set karo, warna string hi rehne do
        if (!isNaN(Number(val)) && val !== '') {
          processedData[field.key] = Number(val);
        } else {
          processedData[field.key] = String(val);
        }
      }
    });
    this.onSave.emit(processedData);
  }

  cancel() {
    this.onCancel.emit();
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
