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
import { MapPin, Clock, User, Check, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

type RideCardProps = {
  ride: Ride;
  onAccept: (rideId: string) => void;
  onReject: (rideId: string) => void;
};

function RideCard({ ride, onAccept, onReject }: RideCardProps) {
  const [appointmentTime, setAppointmentTime] = useState('');

  useEffect(() => {
    setAppointmentTime(
      new Date(ride.appointmentTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    );
  }, [ride.appointmentTime]);

  const isAssigned = ride.status === 'ASSIGNED';

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle className="text-lg">{ride.dropoffLocation}</CardTitle>
        <CardDescription>For {ride.patient.name}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>From: {ride.pickupLocation}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          {appointmentTime ? (
            <span>Appointment at {appointmentTime}</span>
          ) : (
            <span className="h-4 w-24 animate-pulse rounded-md bg-muted" />
          )}
        </div>
        {ride.specialNeeds && ride.specialNeeds.length > 0 && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>Needs: {ride.specialNeeds.join(', ')}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2">
        {isAssigned ? (
            <>
                <Button size="sm" variant="outline" onClick={() => onReject(ride.id)}>
                    <X className="mr-2 h-4 w-4" /> Reject
                </Button>
                <Button size="sm" onClick={() => onAccept(ride.id)}>
                    <Check className="mr-2 h-4 w-4" /> Accept
                </Button>
            </>
        ) : (
            <Button
                size="sm"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 col-span-2"
                onClick={() => onAccept(ride.id)}
                >
                <Check className="mr-2 h-4 w-4" /> Accept Ride
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}

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
  
  const handleReject = (rideId: string) => {
    toast({
      variant: 'destructive',
      title: 'Ride Rejected',
      description: `You have rejected ride ${rideId}. It will be returned to the pending queue.`,
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
            <RideCard key={ride.id} ride={ride} onAccept={handleAccept} onReject={handleReject} />
          ))
        ) : (
          <p className="text-sm text-muted-foreground p-4 text-center">
            No available rides right now.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
