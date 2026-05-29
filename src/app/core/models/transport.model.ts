export interface TransportModel {
  id: number;
  routeName: string;
  driverName: string;
  vehicleNo: string;
  capacity: number;
  assignedStudents: number;
  isActive: boolean;
}

export interface StudentTransportModel {
  id: number;
  studentId: number;
  studentName: string;
  rollNo: string;
  transportId: number;
  routeName: string;
  pickupPoint: string;
  assignedDate: string;
  isActive: boolean;
}
