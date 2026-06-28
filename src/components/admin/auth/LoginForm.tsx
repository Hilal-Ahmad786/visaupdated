'use client';

import { AlertCircle, Loader2, Lock, Mail } from 'lucide-react';
import { useFormState, useFormStatus } from 'react-dom';

import { signInAction, type SignInState } from '@/lib/auth/actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full" aria-disabled={pending}>
      {pending ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : null}
      {pending ? 'Giriş yapılıyor…' : 'Giriş Yap'}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useFormState<SignInState, FormData>(signInAction, {});

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {state.error && (
        <div role="alert" className="flex items-center gap-2 rounded-input border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-sm text-danger">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="field-label">E-posta</label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
          <input id="email" name="email" type="email" autoComplete="username" required placeholder="ornek@visvize.com" className="field-input pl-10" />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="field-label">Parola</label>
          <a href="#sifremi-unuttum" className="text-xs font-medium text-navy hover:text-gold">Parolamı unuttum</a>
        </div>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
          <input id="password" name="password" type="password" autoComplete="current-password" required className="field-input pl-10" />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-ink-soft">
        <input type="checkbox" name="remember" className="h-4 w-4 rounded border-line text-gold focus:ring-gold" />
        Bu cihazda oturumu açık tut
      </label>

      <SubmitButton />
    </form>
  );
}
