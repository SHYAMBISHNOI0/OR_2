export type UserRole = 'patient' | 'admin';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  phone?: string;
  status?: 'active' | 'inactive';
};

export type EquipmentType = 'Wheelchair' | 'Bed' | 'Room' | 'Ambulance' | 'Nurse' | 'Doctor';

export type Equipment = {
    id: string;
    label: string;
    type: EquipmentType;
    status: 'available' | 'occupied';
    assignedTo: string | null; // patientId
};

export type RequestStatus = 'Pending' | 'Assigned' | 'Completed';

export type EquipmentRequest = {
    id: string;
    patientId: string;
    patient: User;
    equipmentType: EquipmentType[];
    status: RequestStatus;
    createdAt: Date;
    fulfilledBy?: string[]; // equipment IDs
    fulfilledAt?: Date;
    timeWindow?: {
        start: Date;
        end: Date;
    },
    priority?: 'High' | 'Medium' | 'Low';
    comments?: string;
};

export type Assignment = {
    id: string;
    patientId: string;
    equipmentIds: string[];
    assignedAt: Date;
};
