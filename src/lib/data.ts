import type { User, Ride, UserRole } from './types';

const users: User[] = [
  { id: 'usr_1', name: 'Admin User', email: 'admin@mediroute.com', role: 'admin', avatarUrl: 'https://picsum.photos/seed/1/40/40', status: 'active' },
  { id: 'usr_2', name: 'Maria Rodriguez', email: 'maria@example.com', role: 'patient', avatarUrl: 'https://picsum.photos/seed/2/40/40', status: 'active' },
  { id: 'usr_3', name: 'David Chen', email: 'david@example.com', role: 'driver', avatarUrl: 'https://picsum.photos/seed/3/40/40', status: 'active' },
  { id: 'usr_4', name: 'John Smith', email: 'john@example.com', role: 'patient', avatarUrl: 'https://picsum.photos/seed/4/40/40', status: 'active' },
  { id: 'usr_5', name: 'Emily White', email: 'emily@example.com', role: 'driver', avatarUrl: 'https://picsum.photos/seed/5/40/40', status: 'inactive' },
  { id: 'usr_6', name: 'Carlos Gomez', email: 'carlos@example.com', role: 'patient', avatarUrl: 'https://picsum.photos/seed/6/40/40', status: 'active' },
];

export const MOCK_USERS = users;

const rides: Ride[] = [
  {
    id: 'rid_1',
    patient: users[1],
    pickupLocation: '123 Oak St, Ruralville',
    dropoffLocation: 'General Hospital, Citytown',
    appointmentTime: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
    status: 'ASSIGNED',
    driver: users[2],
    specialNeeds: [],
    equipment: ['Wheelchair'],
    distance: 25,
    createdAt: new Date(new Date().getTime() - 1 * 60 * 60 * 1000),
  },
  {
    id: 'rid_2',
    patient: users[3],
    pickupLocation: '456 Pine Ave, Countryside',
    dropoffLocation: 'City Clinic, Citytown',
    appointmentTime: new Date(new Date().getTime() + 4 * 60 * 60 * 1000), // 4 hours from now
    status: 'PENDING',
    equipment: [],
    distance: 15,
    createdAt: new Date(new Date().getTime() - 30 * 60 * 1000),
  },
  {
    id: 'rid_3',
    patient: users[5],
    pickupLocation: '789 Maple Rd, Farmland',
    dropoffLocation: 'St. Jude\'s Medical Center',
    appointmentTime: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // Yesterday
    status: 'COMPLETED',
    driver: users[2],
    equipment: [],
    distance: 30,
    createdAt: new Date(new Date().getTime() - 26 * 60 * 60 * 1000),
  },
  {
    id: 'rid_4',
    patient: users[1],
    pickupLocation: '321 Birch Ln, Meadowview',
    dropoffLocation: 'General Hospital, Citytown',
    appointmentTime: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    status: 'COMPLETED',
    driver: users[4],
    equipment: [],
    distance: 22,
    createdAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000),
  },
  {
    id: 'rid_5',
    patient: users[3],
    pickupLocation: '555 Willow Creek, Riverbend',
    dropoffLocation: 'Wellness Center, Citytown',
    appointmentTime: new Date(new Date().getTime() + 6 * 60 * 60 * 1000),
    status: 'PENDING',
    specialNeeds: ['Walker support'],
    equipment: [],
    distance: 18,
    createdAt: new Date(new Date().getTime() - 15 * 60 * 1000),
  },
];

export const MOCK_RIDES = rides;

export const getRidesByRole = (role: UserRole | 'all'): Ride[] => {
  if (role === 'admin' || role === 'all') return MOCK_RIDES;
  if (role === 'driver') return MOCK_RIDES.filter(r => r.status === 'PENDING' || r.driver?.id === 'usr_3');
  if (role === 'patient') return MOCK_RIDES.filter(r => r.patient.id === 'usr_2');
  return [];
}

export const rideHistoryForSummary = `
- 2023-10-01: 123 Oak St to General Hospital, Cost: $25.50
- 2023-10-08: 123 Oak St to General Hospital, Cost: $26.00
- 2023-10-15: 123 Oak St to City Clinic, Cost: $22.00
- 2023-10-22: 123 Oak St to General Hospital, Cost: $25.75
- 2023-11-05: 123 Oak St to General Hospital, Cost: $25.50
- 2023-11-12: 456 Pine Ave to General Hospital, Cost: $35.00
- 2023-11-19: 123 Oak St to General Hospital, Cost: $26.25
`;

export const MOCK_APPOINTMENT_SUGGESTIONS = {
  suggestedTimes: [
    new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    new Date(new Date().setHours(14, 30, 0, 0)).toISOString(),
    new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
  ],
  reasoning: 'These times are suggested based on low predicted traffic and high driver availability in your area. The 10:00 AM slot is prioritized for optimal travel conditions.'
};

export const MOCK_SUMMARY = {
  summary: "The patient has a consistent history of rides, primarily to General Hospital. There's a slight fluctuation in cost, which might be due to traffic or time of day.",
  commonDestinations: "General Hospital is the most frequent destination, with one ride to City Clinic.",
  potentialSavings: "Consider scheduling appointments during off-peak hours (like mid-morning) to potentially reduce costs. Also, check if there are any multi-ride discounts available with MediRoute."
};
