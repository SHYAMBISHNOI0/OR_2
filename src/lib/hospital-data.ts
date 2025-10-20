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

// Rooms with Beds
for (let roomNum = 1; roomNum <= 5; roomNum++) {
    for (let bedNum = 1; bedNum <= 10; bedNum++) {
        equipment.push({ id: `room${roomNum}_bed${bedNum}`, label: `Room ${roomNum} - Bed ${bedNum}`, type: 'Bed', status: 'available', assignedTo: null });
    }
}

// Standalone Beds (if any, adjust as needed) - let's assume all beds are in rooms for now.
// For a total of 50 beds, we have 5 rooms * 10 beds/room = 50 beds.

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
        distanceFromHospital: 15.2,
    },
    {
        id: 'req_2',
        patientId: 'usr_3',
        patient: users.find(u => u.id === 'usr_3')!,
        equipmentType: ['Bed'],
        status: 'Pending',
        createdAt: new Date(new Date().getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
        priority: 'Medium',
        distanceFromHospital: 5.5,
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
        distanceFromHospital: 25.0,
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
        distanceFromHospital: 15.2,
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
    // Note: In a real system, 'doctor1' might become available again after a completed task.
    // For this mock data, we'll assume it's still occupied to show variety, but a real implementation would free it up.
    const equip = equipment.find(e => e.id === completedReq.fulfilledBy![0]);
    // if (equip) equip.status = 'occupied';
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
