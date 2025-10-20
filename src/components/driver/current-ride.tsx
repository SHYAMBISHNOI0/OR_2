'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { Ride } from '@/lib/types';
import { MapPin, Flag, Play, UserCheck, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';

type CurrentRideProps = {
  ride: Ride;
};

export default function CurrentRide({ ride }: CurrentRideProps) {
  const mapImage = placeholderImages.find((img) => img.id === 'map-route-1');
  const { toast } = useToast();

  const handleStatusUpdate = (status: string) => {
    toast({
      title: 'Status Updated',
      description: `Your status is now: ${status}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Trip</CardTitle>
        <CardDescription>
          Navigate to your pickup and drop-off locations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mapImage && (
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={mapImage.imageUrl}
              alt={mapImage.description}
              width={1200}
              height={800}
              data-ai-hint={mapImage.imageHint}
              className="object-cover"
            />
          </div>
        )}
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={ride.patient.avatarUrl} alt={ride.patient.name} />
            <AvatarFallback>{ride.patient.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{ride.patient.name}</p>
            <p className="text-sm text-muted-foreground">
              Contact: {ride.patient.phone ?? 'N/A'}
            </p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-3">
            <div className="mt-1 flex h-4 w-4 items-center justify-center">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium">Pickup</p>
              <p className="text-muted-foreground">{ride.pickupLocation}</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-1 flex h-4 w-4 items-center justify-center">
              <Flag className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium">Drop-off</p>
              <p className="text-muted-foreground">{ride.dropoffLocation}</p>
            </div>
          </li>
        </ul>
      </CardContent>
      <CardFooter className="grid grid-cols-3 gap-2">
        <Button variant="outline" onClick={() => handleStatusUpdate('En Route')}>
          <Play className="mr-2 h-4 w-4" /> Start
        </Button>
        <Button variant="outline" onClick={() => handleStatusUpdate('Patient Onboard')}>
          <UserCheck className="mr-2 h-4 w-4" /> Picked Up
        </Button>
        <Button variant="outline" onClick={() => handleStatusUpdate('Completed')}>
          <CheckCircle className="mr-2 h-4 w-4" /> Complete
        </Button>
      </CardFooter>
    </Card>
  );
}
