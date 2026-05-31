// src/app/shared/config/role-config.ts

export interface RolePermissions {
  canSave: boolean;
  canCancel: boolean;
  canDelete: boolean;
  canAssign: boolean;
}

// roleId mapping: 1=Admin, 2=Teacher, 3=Student, 4=Parent
export const RoleConfig: Record<number, RolePermissions> = {
  1: {
    // Admin
    canSave: true,
    canCancel: true,
    canDelete: true,
    canAssign: true,
  },
  2: {
    // Teacher
    canSave: true,
    canCancel: true,
    canDelete: false,
    canAssign: true,
  },
  3: {
    // Student
    canSave: false,
    canCancel: true,
    canDelete: false,
    canAssign: false,
  },
  4: {
    // Parent
    canSave: false,
    canCancel: true,
    canDelete: false,
    canAssign: false,
  },
};
