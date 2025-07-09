export type fetchRequestOptions = RequestInit & {
  auth?: boolean;
  csrf?: boolean;
  timeoutMs?: number;
};

export async function fetcher<T = unknown>(
  url: string,
  options: fetchRequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Voeg CSRF-token toe vanuit cookie (client side)
  if (options.csrf) {
    const csrf = document.cookie
      .split('; ')
      .find((c) => c.startsWith('csrf_token='))
      ?.split('=')[1];
    if (csrf) {
      headers['x-csrf-token'] = csrf;
    } else if (!csrf) {
      throw {
        error: 'CSRF-token ontbreekt',
        statusCode: 400,
      };
    }
  }

  // Voeg credentials: 'include' toe als je cookies gebruikt
  const credentials = options.csrf || options.auth ? 'include' : undefined;

  // Timeout met AbortController
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 10000); // default 10s

  try {
    let res = await fetch(url, {
      ...options,
      credentials,
      headers,
      signal: controller.signal,
    });

    // Als token verlopen is → probeer 1x te verversen
    if (res.status === 401 && options.auth) {
      const refreshRes = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (refreshRes.ok) {
        // Retry originele request
        res = await fetch(url, {
          ...options,
          credentials,
          headers,
          signal: controller.signal,
        });
      }
    }

    clearTimeout(timeout);

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: 'Er ging iets mis' }));
      throw {
        error: error || `Fout (${res.status})`,
        statusCode: res.status,
      };
    }

    return res.json();
  } catch (err: any) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') {
      throw { error: 'Request timeout', statusCode: 408 };
    }
    if (err.error && err.statusCode) {
      throw err;
    }
    throw { error: err.message || 'Onbekende fout', statusCode: 500 };
  }
}
