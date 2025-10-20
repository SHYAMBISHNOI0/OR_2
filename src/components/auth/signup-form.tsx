'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useOrchestrate } from '@/context/orchestrate-context';
import { useState } from 'react';

export default function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { addUser } = useOrchestrate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addUser({ name, email });
    toast({
      title: 'Signup Successful',
      description: 'Your patient account has been created. Please log in.',
    });
    router.push(`/`);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="full-name">Full Name</Label>
        <Input id="full-name" placeholder="John Doe" required value={name} onChange={e => setName(e.target.value)}/>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <p className='text-xs text-muted-foreground'>Signing up registers you as a patient. Admins are created by invitation only.</p>
      <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
        Create an account
      </Button>
    </form>
  );
}
