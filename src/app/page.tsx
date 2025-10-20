import Link from 'next/link';
import { Hospital } from 'lucide-react';
import LoginForm from '@/components/auth/login-form';
import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images';

export default function LoginPage() {
  const heroImage = placeholderImages.find((img) => img.id === 'login-hero');
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <Hospital className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Orchestrate</h1>
            </div>
            <p className="text-balance text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>
          <LoginForm />
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            width={1800}
            height={1200}
            data-ai-hint={heroImage.imageHint}
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        )}
      </div>
    </div>
  );
}
