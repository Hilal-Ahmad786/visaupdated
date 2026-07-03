'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { createSessionToken, SESSION_COOKIE } from '@/lib/auth/session';
import { authenticate } from '@/lib/auth/users';

export interface SignInState {
  error?: string;
}

/**
 * Sign-in server action. Validates credentials against the `admin_users` table
 * (bootstrap admin seeded from env), then sets a signed session cookie.
 */
export async function signInAction(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  // Generic error message — never reveal which part was wrong.
  const user = await authenticate(email, password);
  if (!user) {
    return { error: 'E-posta veya parola hatalı. Lütfen tekrar deneyin.' };
  }

  const { name, value } = createSessionToken(user);
  cookies().set(name, value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 hours
  });
  redirect('/admin');
}

export async function signOutAction() {
  cookies().delete(SESSION_COOKIE);
  redirect('/admin/giris');
}
