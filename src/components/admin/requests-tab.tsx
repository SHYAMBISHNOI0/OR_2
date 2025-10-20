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
import { MOCK_REQUESTS } from '@/lib/hospital-data';
import { Badge } from '../ui/badge';
import { format } from 'date-fns';

export default function RequestsTab() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const pendingRequests = MOCK_REQUESTS.filter((req) => req.status === 'Pending');

  const handleRunOptimizer = () => {
    setIsLoading(true);
    toast({
      title: 'Running Optimizer...',
      description: 'Assigning pending requests to available equipment.',
    });

    // This is a placeholder for the actual OR-Tools integration.
    // In a real application, this would be an API call to a backend service.
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Optimization Complete!',
        description: 'Pending requests have been assigned.',
      });
    }, 2000);
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
          <h3 className="text-lg font-medium mb-2">Pending Requests</h3>
          <div className="border rounded-lg">
             <div className="grid grid-cols-4 gap-4 p-4 font-semibold border-b">
                <div>Patient</div>
                <div>Requested At</div>
                <div>Equipment</div>
                <div>Priority</div>
            </div>
            {pendingRequests.length > 0 ? (
                <div className="divide-y">
                {pendingRequests.map((req) => (
                    <div key={req.id} className="grid grid-cols-4 gap-4 p-4 text-sm">
                        <div>{req.patient.name}</div>
                        <div>{format(req.createdAt, 'MMM d, h:mm a')}</div>
                        <div>
                            {req.equipmentType.map(e => <Badge key={e} variant="secondary">{e}</Badge>)}
                        </div>
                        <div>
                            <Badge variant={req.priority === 'High' ? 'destructive' : 'outline'}>{req.priority}</Badge>
                        </div>
                    </div>
                ))}
                </div>
            ) : (
                <p className="p-4 text-center text-muted-foreground">No pending requests to optimize.</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleRunOptimizer} disabled={isLoading || pendingRequests.length === 0}>
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Optimizing...
            </>
          ) : (
            <>
              <PlayCircle className="mr-2 h-4 w-4" />
              Run Optimizer
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
