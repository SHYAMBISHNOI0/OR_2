'use client';
import { PageHeader } from '@/components/shared/page-header';
import EquipmentRequestForm from '@/components/patient/equipment-request-form';
import RequestList from '@/components/patient/request-list';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useOrchestrate } from '@/context/orchestrate-context';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { useState } from 'react';

export default function PatientPage() {
  const { requests, currentUser } = useOrchestrate();
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (!currentUser || currentUser.role !== 'patient') {
    return (
      <PageHeader
        title="Access Denied"
        description="You must be logged in as a patient to view this page."
      />
    );
  }

  const myRequests = requests.filter((r) => r.patientId === currentUser.id);
  const pendingRequests = myRequests.filter((r) => r.status === 'Pending');
  const activeRequests = myRequests.filter((r) => r.status === 'Assigned');
  const completedRequests = myRequests.filter((r) => r.status === 'Completed');

  return (
    <>
      <PageHeader
        title="Patient Dashboard"
        description="Request equipment or view your request history."
      >
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Equipment Request
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Equipment</DialogTitle>
              <DialogDescription>
                Fill out the details below to request necessary equipment or
                services.
              </DialogDescription>
            </DialogHeader>
            <EquipmentRequestForm onFormSubmit={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </PageHeader>
      <div className="grid gap-6">
        <RequestList title="Pending Requests" requests={pendingRequests} />
        <RequestList title="Active Assignments" requests={activeRequests} />
        <RequestList title="Completed Requests" requests={completedRequests} />
      </div>
    </>
  );
}
