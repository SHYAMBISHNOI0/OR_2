'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MOCK_RIDES, MOCK_USERS } from '@/lib/data';
import type { Ride, RideStatus, User } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useToast } from '@/hooks/use-toast';

const statusStyles: Record<RideStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  ASSIGNED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  IN_PROGRESS: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
  COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

function AssignDriverDialog({ ride }: { ride: Ride }) {
  const [selectedDriver, setSelectedDriver] = useState<string | undefined>();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const availableDrivers = MOCK_USERS.filter((user) => user.role === 'driver' && user.status === 'active');

  const handleAssign = () => {
    if (!selectedDriver) {
      toast({
        variant: 'destructive',
        title: 'No driver selected',
        description: 'Please select a driver to assign this ride.',
      });
      return;
    }
    toast({
      title: 'Ride Assigned!',
      description: `${ride.patient.name}'s ride has been assigned to a driver.`,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <CheckCircle className="mr-2 h-4 w-4" />
          Approve & Assign
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Driver to Ride</DialogTitle>
          <DialogDescription>
            Select an available driver for{' '}
            <span className="font-semibold">{ride.patient.name}</span>'s ride
            to <span className="font-semibold">{ride.dropoffLocation}</span>.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Select onValueChange={setSelectedDriver} value={selectedDriver}>
            <SelectTrigger>
              <SelectValue placeholder="Select a driver..." />
            </SelectTrigger>
            <SelectContent>
              {availableDrivers.map((driver) => (
                <SelectItem key={driver.id} value={driver.id}>
                  <div className="flex items-center gap-2">
                    <span>{driver.name}</span>
                    <Badge variant="outline">Capacity: 4</Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleAssign}>Assign Driver</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function RidesTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Rides</CardTitle>
        <CardDescription>
          A list of all rides in the system. Approve pending rides and assign drivers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Appointment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_RIDES.map((ride) => (
              <TableRow key={ride.id}>
                <TableCell>
                  <div className="font-medium">{ride.patient.name}</div>
                  <div className="text-sm text-muted-foreground hidden md:inline">
                    {ride.patient.email}
                  </div>
                </TableCell>
                <TableCell>{ride.driver?.name ?? 'Unassigned'}</TableCell>
                <TableCell>
                  {format(ride.appointmentTime, 'MMM d, yyyy h:mm a')}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusStyles[ride.status]}>
                    {ride.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {ride.status === 'PENDING' ? (
                    <AssignDriverDialog ride={ride} />
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Reassign Driver</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Cancel Ride
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
