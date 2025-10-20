import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Ride } from '@/lib/types';
import { format, formatDistanceToNow } from 'date-fns';
import { Badge } from '../ui/badge';
import { Car, Clock, CheckCircle } from 'lucide-react';
import { Separator } from '../ui/separator';

type RideListProps = {
  title: string;
  rides: Ride[];
};

export default function RideList({ title, rides }: RideListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {rides.length > 0 ? (
          <div className="space-y-4">
            {rides.map((ride, index) => (
              <div key={ride.id}>
                <div className="flex items-start space-x-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                      {ride.status === 'COMPLETED' ? 
                        <CheckCircle className="h-4 w-4 text-green-500" /> :
                        <Car className="h-4 w-4 text-secondary-foreground" />
                      }
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{ride.dropoffLocation}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(ride.appointmentTime, 'h:mm a')}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(ride.appointmentTime, 'E, MMM d, yyyy')}
                    </p>
                    {ride.status === 'ASSIGNED' && ride.driver && (
                      <div className="flex items-center pt-2 gap-2">
                        <Avatar className="h-6 w-6">
                           <AvatarImage src={ride.driver.avatarUrl} alt={ride.driver.name} />
                          <AvatarFallback>{ride.driver.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">
                          {ride.driver.name} is on the way.
                        </span>
                         <Badge variant="outline">ETA 15 min</Badge>
                      </div>
                    )}
                     {ride.status === 'PENDING' && (
                      <div className="flex items-center pt-2 gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Waiting for driver assignment...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                 {index < rides.length - 1 && <Separator className="my-4"/>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No rides to display.</p>
        )}
      </CardContent>
    </Card>
  );
}
