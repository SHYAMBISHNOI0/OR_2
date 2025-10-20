'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Sparkles } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { suggestAppointmentTimes } from '@/ai/flows/suggest-appointment-times';
import type { SuggestAppointmentTimesOutput } from '@/ai/flows/suggest-appointment-times';
import { useToast } from '@/hooks/use-toast';
import { MOCK_APPOINTMENT_SUGGESTIONS } from '@/lib/data';
import { Checkbox } from '@/components/ui/checkbox';

const equipmentOptions = [
  { id: 'Wheelchair', label: 'Wheelchair' },
  { id: 'Stretcher', label: 'Stretcher/Bed' },
  { id: 'Oxygen', label: 'Oxygen Tank' },
];

export default function RideRequestForm() {
  const [date, setDate] = useState<Date>();
  const [suggestions, setSuggestions] = useState<SuggestAppointmentTimesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateSuggestions = async () => {
    if (!date) {
      toast({
        variant: 'destructive',
        title: 'Please select an appointment date first.',
      });
      return;
    }
    setIsLoading(true);
    try {
      // In a real app, you'd use form inputs for locations
      const result = await suggestAppointmentTimes({
        pickupLocation: '123 Oak St, Ruralville',
        dropoffLocation: 'General Hospital, Citytown',
        earliestTime: new Date(date.setHours(8, 0, 0, 0)).toISOString(),
        latestTime: new Date(date.setHours(17, 0, 0, 0)).toISOString(),
        priority: 'medium',
      });
      setSuggestions(result);
    } catch (e) {
      console.error(e);
      // Mock data on failure for demo purposes
      setSuggestions(MOCK_APPOINTMENT_SUGGESTIONS);
      toast({
        title: 'Using mock suggestions',
        description: 'AI suggestions are mocked for this demo.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Ride Requested',
      description: 'Your ride request has been submitted and is pending admin approval.',
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request a Ride</CardTitle>
        <CardDescription>
          Fill out the details below to schedule your transportation.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleFormSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="pickup">Pickup Location</Label>
              <Input id="pickup" placeholder="Enter your address" defaultValue="123 Oak St, Ruralville" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dropoff">Destination</Label>
              <Input id="dropoff" placeholder="Enter hospital or clinic" defaultValue="General Hospital, Citytown" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="appointment-date">Appointment Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
             <div className="grid gap-2">
               <Label htmlFor="appointment-time">Appointment Time</Label>
              <Input id="appointment-time" type="time" defaultValue="10:30" />
            </div>
          </div>

          {suggestions && (
             <div className="grid gap-2 rounded-lg border p-4 bg-secondary/50">
                <Label className="flex items-center gap-2 text-secondary-foreground"><Sparkles className="w-4 h-4 text-yellow-500" /> AI Suggested Times</Label>
                <p className="text-sm text-muted-foreground">{suggestions.reasoning}</p>
                <div className="flex gap-2 pt-2">
                    {suggestions.suggestedTimes.slice(0,3).map(time => (
                        <Button key={time} variant="outline" size="sm" onClick={() => toast({ title: `Time set to ${format(new Date(time), 'h:mm a')}`})}>
                            {format(new Date(time), 'h:mm a')}
                        </Button>
                    ))}
                </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label>Necessary Equipment</Label>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {equipmentOptions.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox id={item.id} />
                  <Label htmlFor={item.id} className="font-normal">{item.label}</Label>
                </div>
              ))}
            </div>
          </div>

           <div className="grid gap-2">
            <Label htmlFor="distance">Distance (miles)</Label>
            <Input id="distance" type="number" placeholder="e.g., 25" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="needs">Other Special Needs (optional)</Label>
            <Textarea
              id="needs"
              placeholder="e.g., Walker support, service animal"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleGenerateSuggestions}
            disabled={isLoading || !date}
            type="button"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {isLoading ? 'Thinking...' : 'Suggest Times'}
          </Button>
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Submit Request</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
