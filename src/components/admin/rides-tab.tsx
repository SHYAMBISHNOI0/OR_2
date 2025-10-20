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
import { MOCK_RIDES } from '@/lib/data';
import type { RideStatus } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';

const statusStyles: Record<RideStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  ASSIGNED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  IN_PROGRESS: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
  COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

export default function RidesTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Rides</CardTitle>
        <CardDescription>
          A list of all rides in the system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Appointment</TableHead>
              <TableHead className="hidden md:table-cell">From</TableHead>
              <TableHead className="hidden md:table-cell">To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
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
                <TableCell className="hidden md:table-cell">
                  {ride.pickupLocation}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {ride.dropoffLocation}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusStyles[ride.status]}>
                    {ride.status}
                  </Badge>
                </TableCell>
                <TableCell>
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
                      <DropdownMenuItem className="text-destructive">Cancel Ride</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
