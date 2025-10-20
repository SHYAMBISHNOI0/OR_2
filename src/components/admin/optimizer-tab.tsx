'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, Loader } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MOCK_RIDES } from '@/lib/data';
import { Badge } from '../ui/badge';
import { format } from 'date-fns';

export default function OptimizerTab() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const pendingRides = MOCK_RIDES.filter((ride) => ride.status === 'PENDING');

  const handleRunOptimizer = () => {
    setIsLoading(true);
    toast({
      title: 'Running Optimizer...',
      description: 'Assigning pending rides to available drivers.',
    });

    // Simulate optimizer running
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Optimization Complete!',
        description: 'Rides have been assigned based on current resources.',
      });
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ride Assignment Optimizer</CardTitle>
        <CardDescription>
          Run the optimizer to assign pending rides to the most suitable
          drivers based on location, capacity, and schedule.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Pending Ride Requests</h3>
          <div className="border rounded-lg">
             <div className="grid grid-cols-5 gap-4 p-4 font-semibold border-b">
                <div>Patient</div>
                <div>Appointment</div>
                <div>From</div>
                <div>To</div>
                <div>Equipment</div>
            </div>
            {pendingRides.length > 0 ? (
                <div className="divide-y">
                {pendingRides.map((ride) => (
                    <div key={ride.id} className="grid grid-cols-5 gap-4 p-4 text-sm">
                        <div>{ride.patient.name}</div>
                        <div>{format(ride.appointmentTime, 'MMM d, h:mm a')}</div>
                        <div>{ride.pickupLocation}</div>
                        <div>{ride.dropoffLocation}</div>
                        <div>
                        {ride.equipment && ride.equipment.length > 0 ? (
                            ride.equipment.map(e => <Badge key={e} variant="secondary">{e}</Badge>)
                        ) : (
                            <span className="text-muted-foreground">None</span>
                        )}
                        </div>
                    </div>
                ))}
                </div>
            ) : (
                <p className="p-4 text-center text-muted-foreground">No pending rides to optimize.</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleRunOptimizer} disabled={isLoading || pendingRides.length === 0}>
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Optimizing...
            </>
          ) : (
            <>
              <PlayCircle className="mr-2 h-4 w-4" />
              Run Optimizer
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
