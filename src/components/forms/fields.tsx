'use client';

import { AlertCircle } from 'lucide-react';
import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

import { cn } from '@/lib/utils';

function ErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="field-error" role="alert">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, hint, id, required, className, ...rest },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const errId = `${fieldId}-error`;
  return (
    <div>
      <label htmlFor={fieldId} className="field-label">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      <input
        ref={ref}
        id={fieldId}
        aria-invalid={!!error}
        aria-describedby={error ? errId : undefined}
        className={cn('field-input', error && 'border-danger focus:border-danger focus:ring-danger/30', className)}
        {...rest}
      />
      {hint && !error && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}
      <ErrorText id={errId} message={error} />
    </div>
  );
});

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
};

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { label, error, options, placeholder, id, required, className, ...rest },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const errId = `${fieldId}-error`;
  return (
    <div>
      <label htmlFor={fieldId} className="field-label">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      <select
        ref={ref}
        id={fieldId}
        aria-invalid={!!error}
        aria-describedby={error ? errId : undefined}
        className={cn('field-input', error && 'border-danger focus:border-danger focus:ring-danger/30', className)}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ErrorText id={errId} message={error} />
    </div>
  );
});

type TextAreaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(function TextAreaField(
  { label, error, id, required, className, ...rest },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const errId = `${fieldId}-error`;
  return (
    <div>
      <label htmlFor={fieldId} className="field-label">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      <textarea
        ref={ref}
        id={fieldId}
        rows={4}
        aria-invalid={!!error}
        aria-describedby={error ? errId : undefined}
        className={cn('field-input py-3', error && 'border-danger focus:border-danger focus:ring-danger/30', className)}
        {...rest}
      />
      <ErrorText id={errId} message={error} />
    </div>
  );
});

type ConsentProps = InputHTMLAttributes<HTMLInputElement> & {
  label: React.ReactNode;
  error?: string;
};

export const ConsentCheckbox = forwardRef<HTMLInputElement, ConsentProps>(function ConsentCheckbox(
  { label, error, id, ...rest },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const errId = `${fieldId}-error`;
  return (
    <div>
      <label htmlFor={fieldId} className="flex cursor-pointer items-start gap-2.5 text-sm text-ink-soft">
        <input
          ref={ref}
          id={fieldId}
          type="checkbox"
          aria-invalid={!!error}
          aria-describedby={error ? errId : undefined}
          className="mt-0.5 h-5 w-5 shrink-0 rounded border-line text-gold focus:ring-gold"
          {...rest}
        />
        <span>{label}</span>
      </label>
      <ErrorText id={errId} message={error} />
    </div>
  );
});

/** Honeypot field — visually hidden, must stay empty (anti-spam). */
export function Honeypot({ register }: { register: UseFormRegisterReturn<string> }) {
  return (
    <div className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden" aria-hidden="true">
      <label>
        Web sitesi
        <input type="text" tabIndex={-1} autoComplete="off" {...register} />
      </label>
    </div>
  );
}
