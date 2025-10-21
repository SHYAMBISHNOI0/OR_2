'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { getInitialState } from '@/lib/hospital-data';
import type { User, Equipment, EquipmentRequest, Assignment } from '@/lib/types';

interface OrchestrateState {
  users: User[];
  equipment: Equipment[];
  requests: EquipmentRequest[];
  assignments: Assignment[];
  currentUser: User | null;
}

interface OrchestrateActions {
  login: (userId: string) => void;
  logout: () => void;
  addUser: (user: { name: string; email: string }) => void;
  addRequest: (request: Omit<EquipmentRequest, 'id' | 'status' | 'createdAt' | 'patient'>) => void;
  runOptimizer: (requestId?: string) => { success: boolean, assignedCount?: number, error?: string };
  dischargePatient: (patientId: string) => void;
}

const OrchestrateContext = createContext<
  (OrchestrateState & OrchestrateActions) | undefined
>(undefined);

export const OrchestrateProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<OrchestrateState>(() => {
    const initialState = getInitialState();
    // For demo purposes, automatically log in the admin user.
    return {
      ...initialState,
      currentUser: null, // Start with no user logged in
    };
  });

  const login = (userId: string) => {
    const user = state.users.find((u) => u.id === userId);
    if (user) {
      setState((prev) => ({ ...prev, currentUser: user }));
    }
  };

  const logout = () => {
    setState((prev) => ({ ...prev, currentUser: null }));
  };

  const addUser = (userData: { name: string; email: string }) => {
    setState((prev) => {
        const newUser: User = {
            id: `usr_${prev.users.length + 1}`,
            name: userData.name,
            email: userData.email,
            role: 'patient',
            avatarUrl: `https://picsum.photos/seed/${prev.users.length + 1}/40/40`,
            status: 'active',
        };
        return {
            ...prev,
            users: [...prev.users, newUser],
        }
    });
  };

  const addRequest = (requestData: Omit<EquipmentRequest, 'id' | 'status' | 'createdAt' | 'patient'>) => {
    setState((prev) => {
      const patient = prev.users.find(u => u.id === requestData.patientId);
      if (!patient) return prev;

      const newRequest: EquipmentRequest = {
        id: `req_${new Date().getTime()}`,
        ...requestData,
        patient,
        status: 'Pending',
        createdAt: new Date(),
        priority: requestData.priority || 'Medium',
      };
      return {
        ...prev,
        requests: [newRequest, ...prev.requests],
      };
    });
  };

  const runOptimizer = (requestId?: string) => {
    let assignedCount = 0;
    let optimizationError: string | undefined = undefined;

    setState(prev => {
        let newEquipment = [...prev.equipment];
        let newRequests = [...prev.requests];
        let newAssignments = [...prev.assignments];
        const targetRequestIds = requestId ? [requestId] : prev.requests.filter(r => r.status === 'Pending').map(r => r.id);

        for (const reqId of targetRequestIds) {
            const requestIndex = newRequests.findIndex(r => r.id === reqId);
            if (requestIndex === -1) continue;

            const request = newRequests[requestIndex];
            const assignedEquipmentIds: string[] = [];
            let canFulfill = true;
            let tempEquipmentState = [...newEquipment]; // Create a temporary state for this request's assignments

            for (const type of request.equipmentType) {
                const availableItemIndex = tempEquipmentState.findIndex(e => e.type === type && e.status === 'available');
                if (availableItemIndex !== -1) {
                    const assignedId = tempEquipmentState[availableItemIndex].id;
                    assignedEquipmentIds.push(assignedId);
                    // Temporarily mark as occupied to avoid re-assignment in the same run for the same request
                    tempEquipmentState[availableItemIndex] = { ...tempEquipmentState[availableItemIndex], status: 'occupied', assignedTo: request.patientId };
                } else {
                    canFulfill = false;
                    optimizationError = `Not enough ${type} available for request ${request.id.slice(0, 6)}.`;
                    // No need to revert since we are using a temporary state `tempEquipmentState`
                    break;
                }
            }

            if (canFulfill) {
                newEquipment = tempEquipmentState; // Commit the changes if successful
                newRequests[requestIndex] = { ...request, status: 'Assigned', fulfilledBy: assignedEquipmentIds, fulfilledAt: new Date() };
                
                const existingAssignmentIndex = newAssignments.findIndex(a => a.requestId === request.id);
                if (existingAssignmentIndex === -1) {
                     newAssignments.push({
                        id: `asg_${new Date().getTime()}_${Math.random()}`,
                        requestId: request.id,
                        patientId: request.patientId,
                        equipmentIds: assignedEquipmentIds,
                        assignedAt: new Date(),
                    });
                }
                assignedCount++;
            } else {
                if (requestId) break;
            }
        }
        
        return {
            ...prev,
            equipment: newEquipment,
            requests: newRequests,
            assignments: newAssignments
        }
    });

    return { success: assignedCount > 0, assignedCount, error: optimizationError };
  };

  const dischargePatient = (patientId: string) => {
    setState((prev) => {
      // Find all active assignments for the patient and mark them as discharged
      const updatedAssignments = prev.assignments.map(a => 
        a.patientId === patientId && !a.dischargedAt ? { ...a, dischargedAt: new Date() } : a
      );

      // Get the IDs of equipment to be freed
      const equipmentIdsToFree = prev.assignments
        .filter(a => a.patientId === patientId && !a.dischargedAt)
        .flatMap(a => a.equipmentIds);
        
      // Free up the equipment
      const newEquipment = prev.equipment.map(e => 
        equipmentIdsToFree.includes(e.id) ? { ...e, status: 'available', assignedTo: null } : e
      );

      // Mark original requests as completed
      const requestIdsToComplete = prev.assignments
          .filter(a => a.patientId === patientId && !a.dischargedAt)
          .map(a => a.requestId);

      const newRequests = prev.requests.map(r => 
        requestIdsToComplete.includes(r.id) ? { ...r, status: 'Completed' } : r
      );

      // Filter out discharged assignments from the main assignments list being displayed
      const activeAssignments = updatedAssignments.filter(a => !a.dischargedAt);

      return {
        ...prev,
        assignments: activeAssignments,
        equipment: newEquipment,
        requests: newRequests,
      };
    });
  };

  return (
    <OrchestrateContext.Provider
      value={{ ...state, login, logout, addUser, addRequest, runOptimizer, dischargePatient }}
    >
      {children}
    </OrchestrateContext.Provider>
  );
};

export const useOrchestrate = () => {
  const context = useContext(OrchestrateContext);
  if (context === undefined) {
    throw new Error('useOrchestrate must be used within an OrchestrateProvider');
  }
  return context;
};
