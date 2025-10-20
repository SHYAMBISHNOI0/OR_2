import type { User, Equipment, EquipmentRequest, Assignment, EquipmentType } from './types';

// --- USERS ---
const users: User[] = [
  { id: 'usr_1', name: 'Admin User', email: 'admin@orchestrate.com', role: 'admin', avatarUrl: 'https://picsum.photos/seed/1/40/40', status: 'active' },
  { id: 'usr_2', name: 'Maria Rodriguez', email: 'patient@orchestrate.com', role: 'patient', avatarUrl: 'https://picsum.photos/seed/2/40/40', status: 'active' },
  { id: 'usr_3', name: 'David Chen', email: 'david@example.com', role: 'patient', avatarUrl: 'https://picsum.photos/seed/3/40/40', status: 'active' },
  { id: 'usr_4', name: 'John Smith', email: 'john@example.com', role: 'patient', avatarUrl: 'https://picsum.photos/seed/4/40/40', status: 'active' },
];
export const MOCK_USERS = users;

// --- EQUIPMENT SEED DATA ---
let equipment: Equipment[] = [];

// Wheelchairs
for (let i = 1; i <= 50; i++) {
    equipment.push({ id: `wheelchair${i}`, label: `Wheelchair ${i}`, type: 'Wheelchair', status: 'available', assignedTo: null });
}

// Beds & Rooms
for (let i = 1; i <= 50; i++) {
    equipment.push({ id: `bed${i}`, label: `Bed ${i}`, type: 'Bed', status: 'available', assignedTo: null });
}
for (let roomNum = 1; roomNum <= 5; roomNum++) {
    equipment.push({ id: `room${roomNum}`, label: `Room ${roomNum}`, type: 'Room', status: 'available', assignedTo: null });
}

// Ambulances
for (let i = 1; i <= 10; i++) {
    equipment.push({ id: `ambulance${i}`, label: `Ambulance ${i}`, type: 'Ambulance', status: 'available', assignedTo: null });
}

// Nurses
for (let i = 1; i <= 20; i++) {
    equipment.push({ id: `nurse${i}`, label: `Nurse ${i}`, type: 'Nurse', status: 'available', assignedTo: null });
}

// Doctors
for (let i = 1; i <= 10; i++) {
    equipment.push({ id: `doctor${i}`, label: `Doctor ${i}`, type: 'Doctor', status: 'available', assignedTo: null });
}

// --- INITIAL REQUESTS ---
const requests: EquipmentRequest[] = [
    {
        id: 'req_1',
        patientId: 'usr_2',
        patient: users.find(u => u.id === 'usr_2')!,
        equipmentType: ['Wheelchair', 'Nurse'],
        status: 'Pending',
        createdAt: new Date(new Date().getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        priority: 'High',
    },
    {
        id: 'req_2',
        patientId: 'usr_3',
        patient: users.find(u => u.id === 'usr_3')!,
        equipmentType: ['Bed'],
        status: 'Pending',
        createdAt: new Date(new Date().getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
        priority: 'Medium',
    },
    {
        id: 'req_3',
        patientId: 'usr_4',
        patient: users.find(u => u.id === 'usr_4')!,
        equipmentType: ['Ambulance'],
        status: 'Assigned',
        createdAt: new Date(new Date().getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
        fulfilledBy: ['ambulance3'],
        fulfilledAt: new Date(new Date().getTime() - 4 * 60 * 60 * 1000),
        priority: 'High',
    },
    {
        id: 'req_4',
        patientId: 'usr_2',
        patient: users.find(u => u.id === 'usr_2')!,
        equipmentType: ['Doctor'],
        status: 'Completed',
        createdAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        fulfilledBy: ['doctor1'],
        fulfilledAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000),
        priority: 'Low',
    }
];

// Mark some equipment as occupied based on initial state
const assignedReq = requests.find(r => r.id === 'req_3');
if (assignedReq && assignedReq.fulfilledBy) {
    const equip = equipment.find(e => e.id === assignedReq.fulfilledBy![0]);
    if (equip) {
        equip.status = 'occupied';
        equip.assignedTo = assignedReq.patientId;
    }
}
const completedReq = requests.find(r => r.id === 'req_4');
if (completedReq && completedReq.fulfilledBy) {
    // Note: In a real system, 'doctor1' might become available again, but for mock data, we leave it.
    // This can be adjusted if we want to show it as available.
}


// --- INITIAL ASSIGNMENTS ---
const assignments: Assignment[] = [
    {
        id: 'asg_1',
        requestId: 'req_3',
        patientId: 'usr_4',
        equipmentIds: ['ambulance3'],
        assignedAt: new Date(new Date().getTime() - 4 * 60 * 60 * 1000)
    }
];

export const getInitialState = () => ({
    users: users,
    equipment: equipment,
    requests: requests,
    assignments: assignments,
});
