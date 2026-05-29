import { Component, computed, signal } from '@angular/core';
import { StudentTransportModel, TransportModel } from '../../../core/models/transport.model';
import { ReusableTable, TableColumn } from '../../../shared/components/table/reusable-table/reusable-table';
import { TransportService } from '../../../core/services/transport/transport.service';
import { StudentService } from '../../../core/services/student.service';
import { ToastService } from '../../../shared/services/toast.service';
import { FormField as FF, ReusableForm } from '../../../shared/components/form/reusable-form/reusable-form';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-transport',
  imports: [ReusableTable, DatePipe, ReusableForm],
  templateUrl: './transport.html',
  styleUrl: './transport.scss',
})
export class Transport {
  activeTab = signal<'routes' | 'students'>('routes');

  // Routes
  routes = signal<TransportModel[]>([]);
  routesLoading = signal(false);
  routeForm = signal(false);
  routeSaving = signal(false);
  routeEdit = signal<any>({});
  isRouteEdit = signal(false);

  // Student Transport
  studentTransports = signal<StudentTransportModel[]>([]);
  stLoading = signal(false);
  assignForm = signal(false);
  assignSaving = signal(false);
  students = signal<any[]>([]);
  assignStudentId = signal(0);
  assignTransportId = signal(0);
  assignPickupPoint = signal('');

  // Stats
  totalRoutes = computed(() => this.routes().length);
  totalCapacity = computed(() => this.routes().reduce((s, r) => s + r.capacity, 0));
  totalAssigned = computed(() => this.studentTransports().length);
  totalSeats = computed(() => this.totalCapacity() - this.totalAssigned());

  routeColumns: TableColumn[] = [
    { key: 'routeName', label: 'Route' },
    { key: 'driverName', label: 'Driver' },
    { key: 'vehicleNo', label: 'Vehicle' },
    { key: 'capacity', label: 'Capacity' },
    { key: 'assignedStudents', label: 'Assigned' },
  ];

  stColumns: TableColumn[] = [
    { key: 'rollNo', label: 'Roll No' },
    { key: 'studentName', label: 'Student' },
    { key: 'routeName', label: 'Route' },
    { key: 'pickupPoint', label: 'Pickup Point' },
  ];

  routeFormFields: FF[] = [
    { key: 'routeName', label: 'Route Name', type: 'text', required: true },
    { key: 'driverName', label: 'Driver Name', type: 'text', required: true },
    { key: 'vehicleNo', label: 'Vehicle No', type: 'text', required: true },
    { key: 'capacity', label: 'Capacity', type: 'number', required: true },
  ];

  get unassignedStudents() {
    const assignedIds = this.studentTransports().map((st) => st.studentId);
    return this.students().filter((s) => !assignedIds.includes(s.id));
  }

  constructor(
    private transportService: TransportService,
    private studentService: StudentService,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.loadRoutes();
    this.loadStudentTransports();
    this.studentService.getAll().subscribe({
      next: (res) => this.students.set(res.data),
    });
  }

  loadRoutes() {
    this.routesLoading.set(true);
    this.transportService.getAll().subscribe({
      next: (res) => {
        this.routes.set(res.data);
        this.routesLoading.set(false);
      },
      error: () => this.routesLoading.set(false),
    });
  }

  loadStudentTransports() {
    this.stLoading.set(true);
    this.transportService.getStudentTransports().subscribe({
      next: (res) => {
        this.studentTransports.set(res.data);
        this.stLoading.set(false);
      },
      error: () => this.stLoading.set(false),
    });
  }

  openAddRoute() {
    this.isRouteEdit.set(false);
    this.routeEdit.set({});
    this.routeForm.set(true);
  }

  openEditRoute(r: TransportModel) {
    this.isRouteEdit.set(true);
    this.routeEdit.set({ ...r });
    this.routeForm.set(true);
  }

  onDeleteRoute(r: TransportModel) {
    if (confirm(`Delete route "${r.routeName}"?`)) {
      this.transportService.delete(r.id).subscribe({
        next: () => {
          this.loadRoutes();
          this.toast.success('Route deleted!');
        },
        error: () => this.toast.error('Delete failed!'),
      });
    }
  }

  onSaveRoute(data: any) {
    this.routeSaving.set(true);
    const call = this.isRouteEdit()
      ? this.transportService.update(data.id, data)
      : this.transportService.create(data);
    call.subscribe({
      next: () => {
        this.routeSaving.set(false);
        this.routeForm.set(false);
        this.loadRoutes();
        this.toast.success(this.isRouteEdit() ? 'Route updated!' : 'Route added!');
      },
      error: () => {
        this.routeSaving.set(false);
        this.toast.error('Error!');
      },
    });
  }

  openAssignForm() {
    this.assignStudentId.set(0);
    this.assignTransportId.set(0);
    this.assignPickupPoint.set('');
    this.assignForm.set(true);
  }

  onAssignStudent() {
    if (!this.assignStudentId() || !this.assignTransportId()) {
      this.toast.warning('Select student and route!');
      return;
    }
    this.assignSaving.set(true);
    this.transportService
      .assignStudent({
        studentId: this.assignStudentId(),
        transportId: this.assignTransportId(),
        pickupPoint: this.assignPickupPoint(),
      })
      .subscribe({
        next: () => {
          this.assignSaving.set(false);
          this.assignForm.set(false);
          this.loadRoutes();
          this.loadStudentTransports();
          this.toast.success('Student assigned!');
        },
        error: () => {
          this.assignSaving.set(false);
          this.toast.error('Assignment failed!');
        },
      });
  }

  onRemoveStudent(st: StudentTransportModel) {
    if (confirm(`Remove ${st.studentName} from transport?`)) {
      this.transportService.removeStudent(st.id).subscribe({
        next: () => {
          this.loadRoutes();
          this.loadStudentTransports();
          this.toast.success('Removed successfully!');
        },
        error: () => this.toast.error('Remove failed!'),
      });
    }
  }
}
