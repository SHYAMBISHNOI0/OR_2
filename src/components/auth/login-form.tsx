'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { UserRole } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [role, setRole] = useState<UserRole>('patient');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast({
      title: 'Login Successful',
      description: `Redirecting to ${role} dashboard...`,
    });
    router.push(`/${role}`);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          required
          defaultValue="patient@orchestrate.com"
        />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">Password</Label>
        </div>
        <Input id="password" type="password" required defaultValue="password" />
      </div>
      <div className="grid gap-2">
        <Label>Log in as</Label>
        <RadioGroup
          defaultValue="patient"
          className="grid grid-cols-2 gap-4"
          onValueChange={(value: UserRole) => setRole(value)}
          value={role}
        >
          <div>
            <RadioGroupItem value="patient" id="patient" className="peer sr-only" />
            <Label
              htmlFor="patient"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              Patient
            </Label>
          </div>
          <div>
            <RadioGroupItem value="admin" id="admin" className="peer sr-only" />
            <Label
              htmlFor="admin"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              Admin
            </Label>
          </div>
        </RadioGroup>
      </div>
      <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
        Login
      </Button>
    </form>
  );
}
