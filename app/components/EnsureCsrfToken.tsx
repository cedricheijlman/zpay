// components/EnsureCsrfToken.tsx
'use client';

import { useEffect } from 'react';

export function EnsureCsrfToken() {
  useEffect(() => {
    const hasToken = document.cookie.includes('csrf_token=');
    if (!hasToken) {
      fetch('/api/auth/csrf', {
        method: 'GET',
        credentials: 'include',
      }).catch((err) => {
        console.error('Kon CSRF-token niet ophalen:', err);
      });
    }
  }, []);

  return null;
}
