export type UserRole = 'patient' | 'driver' | 'admin';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  phone?: string;
  status?: 'active' | 'inactive';
};

export type RideStatus = 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type Ride = {
  id: string;
  patient: User;
  pickupLocation: string;
  dropoffLocation: string;
  appointmentTime: Date;
  status: RideStatus;
  driver?: User;
  specialNeeds?: string[];
  equipment?: string[];
  distance?: number;
  createdAt: Date;
};

export type Vehicle = {
  id: string;
  driverId: string;
  type: 'Sedan' | 'SUV' | 'Van (Wheelchair)';
  capacity: number;
  currentLocation: {
    lat: number;
    lng: number;
  };
};
