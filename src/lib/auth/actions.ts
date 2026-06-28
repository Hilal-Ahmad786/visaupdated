'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { checkCredentials, createSessionToken, SESSION_COOKIE } from '@/lib/auth/session';

export interface SignInState {
  error?: string;
}

/**
 * Demo sign-in server action. Validates demo credentials and sets a signed
 * session cookie. Replace `checkCredentials` with a real identity provider;
 * the rest of the app is unchanged.
 */
export async function signInAction(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  // Generic error message — never reveal which part was wrong.
  const userId = checkCredentials(email, password);
  if (!userId) {
    return { error: 'E-posta veya parola hatalı. Lütfen tekrar deneyin.' };
  }

  const { name, value } = createSessionToken(userId);
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
