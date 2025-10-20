'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { getInitialState } from '@/lib/hospital-data';
import type { User, Equipment, EquipmentRequest, Assignment, EquipmentType } from '@/lib/types';

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
    return {
      ...initialState,
      currentUser: null,
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
        id: `req_${prev.requests.length + 1}`,
        ...requestData,
        patient,
        status: 'Pending',
        createdAt: new Date(),
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

            for (const type of request.equipmentType) {
                const availableItemIndex = newEquipment.findIndex(e => e.type === type && e.status === 'available');
                if (availableItemIndex !== -1) {
                    assignedEquipmentIds.push(newEquipment[availableItemIndex].id);
                    // Temporarily mark as occupied to avoid re-assignment in the same run
                    newEquipment[availableItemIndex] = { ...newEquipment[availableItemIndex], status: 'occupied', assignedTo: request.patientId };
                } else {
                    canFulfill = false;
                    optimizationError = `Not enough ${type} available for request ${request.id.slice(0, 6)}.`;
                    // Revert changes for this request
                    assignedEquipmentIds.forEach(assignedId => {
                        const revertIndex = newEquipment.findIndex(e => e.id === assignedId);
                        if (revertIndex !== -1) {
                           newEquipment[revertIndex] = { ...newEquipment[revertIndex], status: 'available', assignedTo: null };
                        }
                    });
                    break; 
                }
            }

            if (canFulfill) {
                newRequests[requestIndex] = { ...request, status: 'Assigned', fulfilledBy: assignedEquipmentIds, fulfilledAt: new Date() };
                newAssignments.push({
                    id: `asg_${newAssignments.length + 1}`,
                    requestId: request.id,
                    patientId: request.patientId,
                    equipmentIds: assignedEquipmentIds,
                    assignedAt: new Date(),
                });
                assignedCount++;
            } else {
                // If we are processing a single request and it fails, we stop and report error.
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
      const newAssignments = [...prev.assignments];
      const newEquipment = [...prev.equipment];
      const newRequests = [...prev.requests];

      const assignmentsToDischarge = newAssignments.filter(a => a.patientId === patientId && !a.dischargedAt);
      
      for (const assignment of assignmentsToDischarge) {
        // Free up equipment
        for (const equipId of assignment.equipmentIds) {
          const equipIndex = newEquipment.findIndex(e => e.id === equipId);
          if (equipIndex !== -1) {
            newEquipment[equipIndex] = { ...newEquipment[equipIndex], status: 'available', assignedTo: null };
          }
        }

        // Mark assignment as discharged
        const assignmentIndex = newAssignments.findIndex(a => a.id === assignment.id);
        if(assignmentIndex !== -1) {
            newAssignments[assignmentIndex] = { ...assignment, dischargedAt: new Date() };
        }

        // Mark original request as completed
        const requestIndex = newRequests.findIndex(r => r.id === assignment.requestId);
        if (requestIndex !== -1) {
          newRequests[requestIndex] = { ...newRequests[requestIndex], status: 'Completed' };
        }
      }

      return {
        ...prev,
        assignments: newAssignments,
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
