// hooks/useLogin.ts
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LoginSchema } from '@/lib/schemas/loginSchema';
import { fetcher } from '@/lib/api/fetcher';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function login(data: LoginSchema) {
    try {
      setLoading(true);
      await fetcher('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
        csrf: true,
      });

      toast.success('Succesvol ingelogd 🎉');
      router.push('/dashboard');
    } catch (error: any) {
      const message =
        error?.error || error?.message || 'Inloggen mislukt. Probeer het later opnieuw.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return {
    login,
    loading,
  };
}
