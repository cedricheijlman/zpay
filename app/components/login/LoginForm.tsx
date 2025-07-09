'use client';
import {
  MdCheck,
  MdExitToApp,
  MdOutlineEmail,
  MdOutlineLock,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
} from 'react-icons/md';
import React, { useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { loginSchema, LoginSchema } from '@/lib/schemas/loginSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useLogin } from '@/lib/hooks/useLogin';

function LoginForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: undefined,
      password: undefined,
      rememberMe: false,
    },
  });
  const remember = watch('rememberMe'); // kijkt wat de huidige waarde is

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { login, loading } = useLogin();

  const onSubmit = async (data: LoginSchema) => {
    await login(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="mx-4 flex w-full max-w-sm flex-col items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-6 shadow-xl sm:max-w-md sm:px-6 sm:py-8 lg:max-w-lg lg:px-8"
    >
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-center text-2xl font-semibold sm:text-3xl">Welkom terug</h1>
        <p className="text-center text-base text-gray-500 sm:text-lg">Log in om verder te gaan</p>
      </div>
      <div className="my-6 flex w-full flex-col items-center justify-center gap-4 sm:my-8">
        <div className="flex w-full flex-col justify-center">
          <label htmlFor="email" className="mb-2  text-sm font-medium text-gray-800 sm:text-base">
            E-mailadres
          </label>

          <div
            className={`flex min-h-[44px] items-center gap-2 rounded-lg border border-gray-300 px-3 transition-all duration-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 ${
              errors.email
                ? 'border border-red-500 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500'
                : ''
            }`}
          >
            <MdOutlineEmail
              className={`mr-1 text-blue-500 ${errors.email ? 'text-red-500' : ''}`}
              size={20}
            />
            <input
              id="email"
              className="size-full py-3 text-sm font-normal text-black placeholder:text-gray-600 focus:outline-none "
              type="email"
              placeholder="je@bedrijf.nl"
              {...register('email')}
              autoComplete="email"
              aria-label="Email"
              role="textbox"
            />
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
        </div>
        <div className="flex w-full flex-col justify-center">
          <label htmlFor="password" className="mb-2 text-sm font-medium text-gray-800 sm:text-base">
            Wachtwoord
          </label>

          <div
            className={`flex min-h-[44px] items-center gap-2 rounded-lg border border-gray-300 px-3 transition-all duration-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 ${
              errors.password
                ? 'border border-red-500 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500'
                : ''
            }`}
          >
            <MdOutlineLock
              className={`mr-1 text-blue-500 ${errors.password ? 'text-red-500' : ''}`}
              size={20}
            />
            <input
              id="password"
              {...register('password')}
              className="size-full py-3 text-sm font-normal text-black placeholder:text-gray-600 focus:outline-none"
              type={showPassword ? 'text' : 'password'}
              placeholder="********"
              autoComplete="current-password"
              aria-label="Wachtwoord"
              role="textbox"
            />
            <MdOutlineVisibility
              className={`cursor-pointer text-blue-500 transition-opacity ${showPassword ? 'hidden' : ''}`}
              onClick={() => setShowPassword(!showPassword)}
              size={20}
              type="button"
              tabIndex={0}
            />
            <MdOutlineVisibilityOff
              className={`cursor-pointer text-blue-500 transition-opacity ${showPassword ? '' : 'hidden'}`}
              onClick={() => setShowPassword(!showPassword)}
              size={20}
              aria-label="Toggle password visibility"
              role="checkbox"
              type="button"
              tabIndex={0}
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="flex w-full flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="rememberMe"
              {...register('rememberMe')}
              name="rememberMe"
              checked={remember}
              onChange={() => setValue('rememberMe', !remember)}
              className="hidden"
            />
            <div
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setValue('rememberMe', !remember);
                }
              }}
              onClick={() => setValue('rememberMe', !remember)}
              className={`flex min-h-[20px] min-w-[20px] cursor-pointer items-center justify-center rounded border border-gray-300 transition-colors duration-200 sm:min-h-[16px] sm:min-w-[16px] ${
                remember ? 'bg-blue-500' : 'bg-transparent'
              }`}
              tabIndex={0}
              aria-checked={remember}
              role="checkbox"
            >
              <MdCheck className="text-white" size={16} />
            </div>
            <label
              htmlFor="rememberMe"
              className="ml-1 cursor-pointer text-sm font-medium text-gray-800"
            >
              Onthoud mij
            </label>
          </div>
          <div>
            <p
              className="cursor-pointer text-sm  font-medium  text-blue-500  hover:text-blue-600 hover:underline"
              tabIndex={0}
            >
              Wachtwoord vergeten?
            </p>
          </div>
        </div>

        <button
          type="submit"
          className={`flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-3 text-sm font-medium
    text-white transition-colors
    duration-200 hover:bg-blue-600 active:bg-blue-700

  `}
        >
          {loading ? <Loader2 className="animate-spin" /> : <MdExitToApp />}
          <p>{loading ? 'Even wachten...' : 'Inloggen'}</p>
        </button>
      </div>
      <div className="flex w-full items-center justify-center">
        <p className="text-sm font-normal text-gray-600 sm:text-base">
          <Link href="/register" className="text-blue-500 hover:text-blue-600">
            Zpay Account aanmaken{' '}
          </Link>
        </p>
      </div>
    </form>
  );
}

export default LoginForm;
