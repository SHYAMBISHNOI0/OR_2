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
import { MOCK_ASSIGNMENTS, MOCK_EQUIPMENT, MOCK_USERS } from '@/lib/hospital-data';
import { Button } from '@/components/ui/button';
import { User, Package, Clock, LogOut } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';


export default function AssignmentsTab() {
  const { toast } = useToast();

  const handleDischarge = (patientName: string) => {
    toast({
        title: 'Patient Discharged',
        description: `${patientName} has been discharged and their assigned equipment is now available.`,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Assignments</CardTitle>
        <CardDescription>
          Live status of all allocated resources and the patients they are assigned to.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Assigned Equipment</TableHead>
              <TableHead>Assigned At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_ASSIGNMENTS.map((assignment) => {
              const patient = MOCK_USERS.find(u => u.id === assignment.patientId);
              if (!patient) return null;
              
              const assignedEquipment = MOCK_EQUIPMENT.filter(e => assignment.equipmentIds.includes(e.id));
              
              return (
              <TableRow key={assignment.id}>
                <TableCell>
                  <div className="font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {patient.name}
                  </div>
                  <div className="text-sm text-muted-foreground ml-6">
                    {patient.email}
                  </div>
                </TableCell>
                <TableCell>
                    <div className='flex flex-wrap gap-1'>
                        {assignedEquipment.map(e => (
                            <Badge key={e.id} variant="secondary">
                                <Package className="mr-1 h-3 w-3" />
                                {e.label}
                            </Badge>
                        ))}
                    </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {format(assignment.assignedAt, 'MMM d, h:mm a')}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => handleDischarge(patient.name)}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Discharge
                    </Button>
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
