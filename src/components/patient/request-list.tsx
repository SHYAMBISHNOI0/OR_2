'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { EquipmentRequest } from '@/lib/types';
import { format, formatDistanceToNow } from 'date-fns';
import { Badge } from '../ui/badge';
import { Clock, CheckCircle, Package, AlertCircle } from 'lucide-react';
import { Separator } from '../ui/separator';
import { useOrchestrate } from '@/context/orchestrate-context';

type RequestListProps = {
  title: string;
  requests: EquipmentRequest[];
};

const statusIcons: Record<EquipmentRequest['status'], React.ElementType> = {
    Pending: AlertCircle,
    Assigned: Clock,
    Completed: CheckCircle,
}

const statusColors: Record<EquipmentRequest['status'], string> = {
    Pending: 'text-yellow-500',
    Assigned: 'text-blue-500',
    Completed: 'text-green-500',
}

export default function RequestList({ title, requests }: RequestListProps) {
    const { users } = useOrchestrate();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title} ({requests.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((req, index) => {
              const StatusIcon = statusIcons[req.status];
              const patient = users.find(u => u.id === req.patientId);
              return (
              <div key={req.id}>
                <div className="flex items-start space-x-4">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-secondary ${statusColors[req.status]}`}>
                        <StatusIcon className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Request for {patient?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(req.createdAt, { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {req.equipmentType.map(type => (
                        <Badge key={type} variant="outline">
                           <Package className="mr-1 h-3 w-3" /> {type}
                        </Badge>
                      ))}
                    </div>
                    {req.status === 'Pending' && (
                      <p className="text-sm text-muted-foreground pt-1">
                        Awaiting assignment by an administrator.
                      </p>
                    )}
                    {req.status === 'Assigned' && (
                        <p className="text-sm text-muted-foreground pt-1">
                            Equipment has been assigned and is being prepared.
                        </p>
                    )}
                    {req.status === 'Completed' && req.fulfilledAt && (
                        <p className="text-sm text-muted-foreground pt-1">
                            Completed on {format(req.fulfilledAt, 'MMM d, yyyy')}
                        </p>
                    )}
                  </div>
                </div>
                 {index < requests.length - 1 && <Separator className="my-4"/>}
              </div>
            )})}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground p-4 text-center">No requests to display.</p>
        )}
      </CardContent>
    </Card>
  );
}
