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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { EquipmentType } from '@/lib/types';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '../ui/select';

const equipmentOptions: { id: EquipmentType, label: string }[] = [
  { id: 'Wheelchair', label: 'Wheelchair' },
  { id: 'Bed', label: 'Hospital Bed' },
  { id: 'Ambulance', label: 'Ambulance Transport' },
  { id: 'Nurse', label: 'Nurse Assistance' },
  { id: 'Doctor', label: 'Doctor Consultation' },
];

export default function EquipmentRequestForm() {
  const [date, setDate] = useState<Date>();
  const { toast } = useToast();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Request Submitted',
      description: 'Your equipment request has been submitted and is pending admin approval.',
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Equipment</CardTitle>
        <CardDescription>
          Fill out the details below to request necessary equipment or services.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleFormSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label>Necessary Equipment / Services</Label>
            <div className="flex flex-col space-y-2">
              {equipmentOptions.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox id={item.id} />
                  <Label htmlFor={item.id} className="font-normal">{item.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start-date">Time Window Start</Label>
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
               <Label htmlFor="start-time">Start Time</Label>
              <input id="start-time" type="time" className="border-input bg-background w-full rounded-md border px-3 py-1.5 text-sm" defaultValue="09:00" />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="priority">Priority</Label>
            <Select defaultValue='Medium'>
                <SelectTrigger>
                    <SelectValue placeholder="Select priority level..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="needs">Comments (optional)</Label>
            <Textarea
              id="needs"
              placeholder="e.g., Patient is on the 3rd floor, requires assistance."
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Submit Request</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
