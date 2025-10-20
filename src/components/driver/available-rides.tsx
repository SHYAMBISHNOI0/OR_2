'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from '@/components/ui/card';
import type { Ride } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Clock, User, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';

type AvailableRidesProps = {
  rides: Ride[];
};

export default function AvailableRides({ rides }: AvailableRidesProps) {
  const { toast } = useToast();

  const handleAccept = (rideId: string) => {
    toast({
      title: 'Ride Accepted',
      description: `You have accepted ride ${rideId}. See details for your trip.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Rides</CardTitle>
        <CardDescription>Rides near you waiting for a driver.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {rides.length > 0 ? (
          rides.map((ride) => (
            <Card key={ride.id} className="bg-background">
              <CardHeader>
                <CardTitle className="text-lg">{ride.dropoffLocation}</CardTitle>
                <CardDescription>
                  For {ride.patient.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>From: {ride.pickupLocation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Appointment at {new Date(ride.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                {ride.specialNeeds && ride.specialNeeds.length > 0 && (
                   <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Needs: {ride.specialNeeds.join(', ')}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => handleAccept(ride.id)}>
                  <Check className="mr-2 h-4 w-4" /> Accept Ride
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="text-sm text-muted-foreground p-4 text-center">No available rides right now.</p>
        )}
      </CardContent>
    </Card>
  );
}
