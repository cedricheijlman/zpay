import Image from 'next/image';
import React from 'react';
import { EnsureCsrfToken } from '../components/EnsureCsrfToken';

function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col items-center sm:mb-8">
        <Image
          src="/images/logos/zpay-logo.png"
          alt="ZPay"
          width={120}
          height={60}
          className="h-12 w-auto sm:h-16 lg:h-20"
        />
        <p className="mt-4 text-center text-base text-gray-600 sm:text-lg lg:text-xl">
          Enterprise ZZP Facturatie Platform
        </p>
      </div>
      {children}
      <EnsureCsrfToken />
    </main>
  );
}

export default AuthLayout;
