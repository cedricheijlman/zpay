import LoginForm from '@/app/components/login/LoginForm';
import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login – ZPay Enterprise Facturatie',
  description:
    'Log in op je ZPay-account: hét slimme facturatie- en betalingssysteem voor zelfstandige professionals. Beveiligd, snel en klaar voor schaalbare groei.',
  robots: 'noindex, nofollow',
  metadataBase: new URL('https://example.com'), // <–– pas dit later aan
  alternates: {
    canonical: '/login',
  },
  category: 'Business, Finance, SaaS',
  keywords: [
    'ZPay',
    'zzp facturatie',
    'online factuur maken',
    'facturatieplatform',
    'betalen als zzp',
    'supersnelle facturatie',
    'enterprise saas',
    'notion factuur',
    'stripe voor zzp',
    'nextjs 15 saas',
  ],
  openGraph: {
    title: 'Login – ZPay Enterprise Facturatie',
    description:
      'Toegang tot jouw professionele facturatieomgeving. ZPay biedt slimme AI-functionaliteit, snelle betalingen en een strak design.',
    url: '/login', // relatieve URL voor nu
    siteName: 'ZPay',
    locale: 'nl_NL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Login – ZPay Facturatie',
    description:
      'Log in op ZPay: jouw slimme en visueel strakke omgeving voor facturatie en betalingen.',
  },
};

function LoginPage() {
  return (
    <section
      aria-labelledby="login-title"
      className="flex w-full flex-col items-center justify-center"
    >
      <LoginForm />
    </section>
  );
}

export default LoginPage;
