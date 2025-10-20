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
import type { EquipmentType } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useState } from 'react';
import { useOrchestrate } from '@/context/orchestrate-context';

const statusStyles: Record<'available' | 'occupied', string> = {
  available: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  occupied: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
};

const equipmentTypes: EquipmentType[] = ['Wheelchair', 'Bed', 'Room', 'Ambulance', 'Nurse', 'Doctor'];


export default function EquipmentTab() {
  const { equipment, users } = useOrchestrate();
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  const filteredEquipment = equipment.filter(e => typeFilter === 'all' || e.type === typeFilter);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
            <CardTitle>All Equipment</CardTitle>
            <CardDescription>
            View and manage all hospital equipment and personnel.
            </CardDescription>
        </div>
        <Select onValueChange={setTypeFilter} defaultValue="all">
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type..." />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {equipmentTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
            </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEquipment.map((item) => {
              const assignedUser = item.assignedTo ? users.find(u => u.id === item.assignedTo) : null;
              return (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.label}</TableCell>
                <TableCell>
                  <Badge variant="outline">{item.type}</Badge>
                </TableCell>
                <TableCell>
                    <Badge variant="outline" className={`${statusStyles[item.status]} capitalize`}>
                        {item.status}
                    </Badge>
                </TableCell>
                <TableCell>{assignedUser?.name ?? 'N/A'}</TableCell>
                <TableCell className="text-right">
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
                      <DropdownMenuItem>Mark for Maintenance</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
