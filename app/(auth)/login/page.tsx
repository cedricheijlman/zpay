import LoginForm from '@/app/components/login/LoginForm';
import React from 'react';

export const metadata = {
  title: 'Login - Zpay',
  description: 'Login to your Zpay account',
  robots: 'noindex, nofollow',
};

function LoginPage() {
  return (
    <section className="flex w-full flex-col items-center justify-center">
      <LoginForm />
    </section>
  );
}

export default LoginPage;
