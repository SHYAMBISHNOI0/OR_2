import { PageHeader } from '@/components/shared/page-header';
import { MOCK_RIDES } from '@/lib/data';
import AvailableRides from '@/components/driver/available-rides';
import CurrentRide from '@/components/driver/current-ride';

export default function DriverPage() {
  const availableRides = MOCK_RIDES.filter(r => r.status === 'PENDING');
  const currentRide = MOCK_RIDES.find(r => r.status === 'ASSIGNED' && r.driver?.id === 'usr_3');

  return (
    <>
      <PageHeader
        title="Driver Dashboard"
        description="View available rides and manage your current trip."
      />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <AvailableRides rides={availableRides} />
        </div>
        <div>
          {currentRide ? (
            <CurrentRide ride={currentRide} />
          ) : (
             <div className="border-2 border-dashed rounded-lg p-8 text-center h-full flex flex-col justify-center">
              <p className="text-muted-foreground">You have no active ride.</p>
              <p className="text-sm text-muted-foreground">Accept a ride from the available list.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
