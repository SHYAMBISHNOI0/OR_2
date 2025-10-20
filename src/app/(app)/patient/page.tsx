import { PageHeader } from '@/components/shared/page-header';
import EquipmentRequestForm from '@/components/patient/equipment-request-form';
import RequestList from '@/components/patient/request-list';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { MOCK_REQUESTS } from '@/lib/hospital-data';

export default function PatientPage() {
  const pendingRequests = MOCK_REQUESTS.filter(r => r.status === 'Pending');
  const activeRequests = MOCK_REQUESTS.filter(r => r.status === 'Assigned');
  const completedRequests = MOCK_REQUESTS.filter(r => r.status === 'Completed');

  return (
    <>
      <PageHeader
        title="Patient Dashboard"
        description="Request equipment or view your request history."
      >
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Equipment Request
        </Button>
      </PageHeader>
      <div className="grid gap-6 md:grid-cols-5">
        <div className="md:col-span-2">
          <EquipmentRequestForm />
        </div>
        <div className="md:col-span-3 space-y-6">
          <RequestList title="Pending Requests" requests={pendingRequests} />
          <RequestList title="Active Assignments" requests={activeRequests} />
          <RequestList title="Completed Requests" requests={completedRequests} />
        </div>
      </div>
    </>
  );
}
