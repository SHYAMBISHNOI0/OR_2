'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useOrchestrate } from '@/context/orchestrate-context';

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { login, users } = useOrchestrate();
  const [email, setEmail] = useState('patient@orchestrate.com');
  const [password, setPassword] = useState('password');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user = users.find(u => u.email === email);

    if (user && password === 'password') { // Simplified auth
      login(user.id);
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${user.name}! Redirecting...`,
      });
      router.push(`/${user.role}`);
    } else {
        toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: 'Invalid email or password.',
        });
    }
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">Password</Label>
        </div>
        <Input 
            id="password" 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <p className='text-xs text-muted-foreground'>
        Use `admin@orchestrate.com` or `patient@orchestrate.com` with password `password`.
      </p>
      <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
        Login
      </Button>
    </form>
  );
}
