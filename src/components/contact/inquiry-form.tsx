'use client';

import { useActionState, useId } from 'react';
import { useTranslations } from 'next-intl';

import { sendInquiry, type InquiryState } from '@/app/actions/inquiry';
import { buttonStyles } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

const initial: InquiryState = { status: 'idle' };

const topics = [
  'tombstones',
  'countertops',
  'windowsills',
  'stairs',
  'fireplaces',
  'granites',
  'conglomerates',
  'other',
] as const;

export function InquiryForm() {
  const [state, action, pending] = useActionState(sendInquiry, initial);
  const t = useTranslations('contact.form');
  const formId = useId();

  if (state.status === 'ok') {
    return (
      <div
        role="status"
        className="rounded-lg border border-brass-500/30 bg-stone-50 px-6 py-10 text-center"
      >
        <p className="text-xl text-ink-900">{t('successTitle')}</p>
        <p className="mt-3 leading-relaxed text-ink-600">{t('successBody')}</p>
      </div>
    );
  }

  return (
    <form action={action} className="relative space-y-5" noValidate>
      {/* Pułapka na boty: pole poza ekranem, bez etykiety w drzewie. */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <input
          id={`${formId}-website`}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Field
        label={t('name')}
        error={state.fieldErrors?.name ? t('errors.name') : undefined}
      >
        <input
          required
          name="name"
          type="text"
          autoComplete="name"
          maxLength={120}
          className={inputClass}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label={t('email')}
          error={state.fieldErrors?.email ? t('errors.email') : undefined}
        >
          <input
            required
            name="email"
            type="email"
            autoComplete="email"
            maxLength={180}
            className={inputClass}
          />
        </Field>
        <Field
          label={t('phone')}
          error={state.fieldErrors?.phone ? t('errors.phone') : undefined}
        >
          <input
            required
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={40}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label={t('topic')}>
        <select name="topic" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            {t('topicPlaceholder')}
          </option>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {t(`topics.${topic}`)}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label={t('message')}
        error={
          state.fieldErrors?.message === 'rate'
            ? t('errors.rate')
            : state.fieldErrors?.message
              ? t('errors.message')
              : undefined
        }
      >
        <textarea
          required
          name="message"
          rows={6}
          minLength={10}
          maxLength={4000}
          className={`${inputClass} resize-y`}
        />
      </Field>

      <Field
        label={t('files')}
        hint={t('filesHint')}
        error={
          state.fieldErrors?.files
            ? t(`errors.files.${state.fieldErrors.files}`)
            : undefined
        }
      >
        <input
          name="files"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/heic,application/pdf"
          className="block w-full text-sm text-ink-600 file:mr-4 file:rounded-full file:border-0 file:bg-ink-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-stone-50 hover:file:bg-ink-700"
        />
      </Field>

      <label className="flex items-start gap-3 text-sm leading-relaxed text-ink-600">
        <input
          required
          name="consent"
          type="checkbox"
          className="mt-1 size-4 accent-ink-900"
        />
        <span>
          {t.rich('consent', {
            privacy: (chunk) => (
              <Link
                href="/polityka-prywatnosci-i-cookies"
                className="text-brass-600 underline underline-offset-4 hover:text-brass-500"
              >
                {chunk}
              </Link>
            ),
          })}
        </span>
      </label>
      {state.fieldErrors?.consent ? (
        <p className="text-sm text-red-700">{t('errors.consent')}</p>
      ) : null}

      {state.status === 'error' && !state.fieldErrors ? (
        <p role="alert" className="text-sm text-red-700">
          {t('errors.generic')}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className={buttonStyles('primary', 'lg')}
      >
        {pending ? t('sending') : t('submit')}
      </button>
    </form>
  );
}

const inputClass =
  'w-full rounded-lg border border-ink-900/12 bg-white px-4 py-3 text-ink-900 outline-none transition-colors focus:border-brass-500';

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-ink-800">{label}</span>
      {children}
      {hint && !error ? (
        <span className="mt-1.5 block text-xs text-stone-500">{hint}</span>
      ) : null}
      {error ? (
        <span role="alert" className="mt-1.5 block text-sm text-red-700">
          {error}
        </span>
      ) : null}
    </label>
  );
}
