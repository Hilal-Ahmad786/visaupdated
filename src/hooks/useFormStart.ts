'use client';

import { useCallback, useRef } from 'react';

import { trackFormStart } from '@/lib/tracking/events';

export interface FormStartMeta {
  form_id: string;
  form_name: string;
  lead_type?: string;
  country?: string;
  visa_type?: string;
}

/**
 * Fires `vis_form_start` the first time the user interacts with a lead form,
 * and only ONCE per form per pageview. Spread the returned handlers onto the
 * <form> element (they fire on the first focus or input within it):
 *
 *   const formStart = useFormStart({ form_id: 'x', form_name: 'X' });
 *   <form {...formStart.handlers} ...>
 *
 * `getMeta` lets callers pass live values (e.g. selected country) captured at
 * interaction time.
 */
export function useFormStart(meta: FormStartMeta, getMeta?: () => Partial<FormStartMeta>) {
  const fired = useRef(false);

  const fire = useCallback(() => {
    if (fired.current) return;
    fired.current = true;
    trackFormStart({ ...meta, ...(getMeta?.() ?? {}) });
  }, [meta, getMeta]);

  return {
    fireFormStart: fire,
    /** Spread onto the <form>. Uses capture-phase focus/input for reliability. */
    handlers: {
      onFocusCapture: fire,
      onInputCapture: fire,
    },
  };
}
