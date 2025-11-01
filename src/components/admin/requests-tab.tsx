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
import { Badge } from '../ui/badge';
import { format } from 'date-fns';
import { useOrchestrate } from '@/context/orchestrate-context';
import { EquipmentRequest } from '@/lib/types';

const consultancyTypeClasses = {
    online: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    offline: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
}

export default function RequestsTab() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { requests, runOptimizer } = useOrchestrate();

  const pendingRequests = requests.filter((req) => req.status === 'Pending');

  const handleRunOptimizer = () => {
    setIsLoading(true);
    toast({
      title: 'Running Optimizer...',
      description: 'Assigning all pending requests to available equipment.',
    });

    setTimeout(() => {
      const result = runOptimizer();
      setIsLoading(false);

      if (result.success) {
        toast({
          title: 'Optimization Complete!',
          description: `${result.assignedCount} requests have been assigned.`,
        });
      } else {
        toast({
            variant: 'destructive',
            title: 'Optimization Failed',
            description: result.error || 'Could not assign all requests. Check equipment availability.',
        });
      }
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Equipment Requests</CardTitle>
        <CardDescription>
          Run the optimizer to assign pending requests to available equipment and personnel.
          This is a live view of incoming requests.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Pending Requests ({pendingRequests.length})</h3>
          <div className="border rounded-lg">
             <div className="grid grid-cols-7 gap-4 p-4 font-semibold border-b bg-muted/50">
                <div className="col-span-2">Patient</div>
                <div>Type</div>
                <div>Distance</div>
                <div>Equipment</div>
                <div>Priority</div>
                <div>Action</div>
            </div>
            {pendingRequests.length > 0 ? (
                <div className="divide-y">
                {pendingRequests.map((req) => (
                    <RequestRow key={req.id} req={req} />
                ))}
                </div>
            ) : (
                <p className="p-4 text-center text-muted-foreground">No pending requests.</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleRunOptimizer} disabled={isLoading || pendingRequests.length === 0}>
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Optimizing All...
            </>
          ) : (
            <>
              <PlayCircle className="mr-2 h-4 w-4" />
              Run Optimizer For All
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

function RequestRow({ req }: { req: EquipmentRequest }) {
    const { runOptimizer } = useOrchestrate();
    const { toast } = useToast();
    const [isAccepting, setIsAccepting] = useState(false);

    const handleAcceptRequest = (requestId: string) => {
        setIsAccepting(true);
        setTimeout(() => {
            const result = runOptimizer(requestId);
            if (result.success) {
                toast({
                    title: "Request Accepted",
                    description: `Request ${requestId.slice(0,6)} has been assigned.`
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: "Assignment Failed",
                    description: result.error
                });
            }
            setIsAccepting(false);
        }, 1000);
    }


    return (
        <div className="grid grid-cols-7 gap-4 p-4 text-sm items-center">
            <div className="col-span-2">
                <div>{req.patient.name}</div>
                <div className="text-xs text-muted-foreground">{format(req.createdAt, 'MMM d, h:mm a')}</div>
            </div>
             <div>
                <Badge variant="outline" className={`${consultancyTypeClasses[req.consultancyType]} capitalize`}>
                    {req.consultancyType}
                </Badge>
            </div>
            <div>
                {req.consultancyType === 'offline' ? `${req.distanceFromHospital} km` : 'N/A'}
            </div>
            <div>
                <div className="flex flex-wrap gap-1">
                    {req.equipmentType.map(e => <Badge key={e} variant="secondary">{e}</Badge>)}
                </div>
            </div>
            <div>
                <Badge variant={req.priority === 'High' ? 'destructive' : 'outline'}>{req.priority}</Badge>
            </div>
            <div>
                <Button size="sm" onClick={() => handleAcceptRequest(req.id)} disabled={isAccepting}>
                    {isAccepting ? <Loader className="h-4 w-4 animate-spin" /> : 'Accept'}
                </Button>
            </div>
        </div>
    )
}
