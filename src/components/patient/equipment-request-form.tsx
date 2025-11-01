'use client';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { EquipmentType, ConsultancyType } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '../ui/select';
import { useOrchestrate } from '@/context/orchestrate-context';
import { Input } from '../ui/input';

const allEquipmentOptions: { id: EquipmentType, label: string }[] = [
  { id: 'Wheelchair', label: 'Wheelchair' },
  { id: 'Bed', label: 'Hospital Bed' },
  { id: 'Ambulance', label: 'Ambulance Transport' },
  { id: 'Nurse', label: 'Nurse Assistance' },
  { id: 'Doctor', label: 'Doctor Consultation' },
];

const onlineEquipmentOptions = allEquipmentOptions.filter(
    (opt) => opt.id === 'Doctor' || opt.id === 'Nurse'
);

type EquipmentRequestFormProps = {
    onFormSubmit: () => void;
}

export default function EquipmentRequestForm({ onFormSubmit }: EquipmentRequestFormProps) {
  const { toast } = useToast();
  const { currentUser, addRequest } = useOrchestrate();
  const [consultancyType, setConsultancyType] = useState<ConsultancyType>('offline');
  const [selectedEquipment, setSelectedEquipment] = useState<Set<EquipmentType>>(new Set());
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [distance, setDistance] = useState<number | ''>('');
  const [comments, setComments] = useState('');

  const handleConsultancyChange = (value: ConsultancyType) => {
    setConsultancyType(value);
    setSelectedEquipment(new Set()); // Reset equipment selection
  }

  const handleCheckboxChange = (type: EquipmentType, checked: boolean) => {
    setSelectedEquipment(prev => {
        const newSet = new Set(prev);
        if (checked) {
            newSet.add(type);
        } else {
            newSet.delete(type);
        }
        return newSet;
    });
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || selectedEquipment.size === 0) {
        toast({
            variant: 'destructive',
            title: 'Invalid Request',
            description: 'You must select at least one resource.'
        })
        return;
    }

    let numericDistance = 0;
    if (consultancyType === 'offline') {
        numericDistance = Number(distance);
        if (distance === '' || numericDistance <= 0) {
            toast({
                variant: 'destructive',
                title: 'Invalid Distance',
                description: 'Please enter a valid distance from the hospital for offline consultations.'
            })
            return;
        }
    }


    addRequest({
        patientId: currentUser.id,
        consultancyType,
        equipmentType: Array.from(selectedEquipment),
        priority,
        distanceFromHospital: numericDistance,
        comments,
    });

    toast({
      title: 'Request Submitted',
      description: 'Your request has been submitted and is pending admin approval.',
    });
    onFormSubmit();
  }
  
  const equipmentOptions = consultancyType === 'online' ? onlineEquipmentOptions : allEquipmentOptions;

  return (
    <form onSubmit={handleFormSubmit} className="grid gap-6">
         <div className="grid gap-2">
            <Label>Consultancy Type</Label>
            <RadioGroup defaultValue="offline" onValueChange={(v: ConsultancyType) => handleConsultancyChange(v)} className="flex gap-4">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="offline" id="offline" />
                    <Label htmlFor="offline">Offline Consultancy</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online">Online Consultancy</Label>
                </div>
            </RadioGroup>
        </div>

        <div className="grid gap-2">
            <Label>Necessary Resources</Label>
            <div className="grid grid-cols-2 gap-2">
                {equipmentOptions.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox 
                        id={item.id} 
                        onCheckedChange={(checked) => handleCheckboxChange(item.id, !!checked)}
                        checked={selectedEquipment.has(item.id)}
                    />
                    <Label htmlFor={item.id} className="font-normal">{item.label}</Label>
                </div>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={(v: 'High' | 'Medium' | 'Low') => setPriority(v)}>
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
            {consultancyType === 'offline' && (
                <div className="grid gap-2">
                    <Label htmlFor="distance">Distance from Hospital (km)</Label>
                    <Input
                        id="distance"
                        type="number"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value === '' ? '' : parseFloat(e.target.value))}
                        placeholder="e.g., 10.5"
                        required
                    />
                </div>
            )}
        </div>

        <div className="grid gap-2">
        <Label htmlFor="needs">Comments (optional)</Label>
        <Textarea
            id="needs"
            placeholder="e.g., Patient is on the 3rd floor, requires assistance."
            value={comments}
            onChange={e => setComments(e.target.value)}
        />
        </div>
        <div className="flex justify-end">
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Submit Request</Button>
        </div>
    </form>
  );
}
