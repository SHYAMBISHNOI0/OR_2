import { PageHeader } from '@/components/shared/page-header';
import RideRequestForm from '@/components/patient/ride-request-form';
import RideList from '@/components/patient/ride-list';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { MOCK_RIDES } from '@/lib/data';

export default function PatientPage() {
  const upcomingRides = MOCK_RIDES.filter(r => r.status === 'ASSIGNED' || r.status === 'PENDING');
  const pastRides = MOCK_RIDES.filter(r => r.status === 'COMPLETED' || r.status === 'CANCELLED');

  return (
    <>
      <PageHeader
        title="Patient Dashboard"
        description="Request a new ride or view your ride history."
      >
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Ride Request
        </Button>
      </PageHeader>
      <div className="grid gap-6 md:grid-cols-5">
        <div className="md:col-span-2">
          <RideRequestForm />
        </div>
        <div className="md:col-span-3 space-y-6">
          <RideList title="Upcoming Rides" rides={upcomingRides} />
          <RideList title="Past Rides" rides={pastRides} />
        </div>
      </div>
    </>
  );
}
