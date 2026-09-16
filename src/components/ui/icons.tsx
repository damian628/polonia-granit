import type { SVGProps } from 'react';

/**
 * Ikony wpisane ręcznie zamiast biblioteki. Potrzebujemy ich kilkanaście,
 * a każda waży kilkaset bajtów - to tańsze niż dociąganie paczki z ikonami
 * i pozwala trzymać budżet JS-u na stronie.
 */

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      width={20}
      height={20}
      {...props}
    >
      {children}
    </svg>
  );
}

export const PhoneIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6.6 3h-2A1.6 1.6 0 0 0 3 4.7c0 8.5 6.8 15.3 15.3 15.3a1.6 1.6 0 0 0 1.7-1.6v-2a1.6 1.6 0 0 0-1.3-1.6l-2.4-.5a1.6 1.6 0 0 0-1.6.6l-.8 1a12.3 12.3 0 0 1-5.1-5.1l1-.8a1.6 1.6 0 0 0 .6-1.6l-.5-2.4A1.6 1.6 0 0 0 6.6 3Z" />
  </Icon>
);

export const MailIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
    <path d="m3.5 6.5 8.5 6 8.5-6" />
  </Icon>
);

export const PinIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M19 10c0 5.2-5.6 10.2-6.5 11a.8.8 0 0 1-1 0C10.6 20.2 5 15.2 5 10a7 7 0 0 1 14 0Z" />
    <circle cx="12" cy="10" r="2.6" />
  </Icon>
);

export const ClockIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5V12l3 2" />
  </Icon>
);

export const ChevronDownIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m6 9.5 6 6 6-6" />
  </Icon>
);

export const MenuIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Icon>
);

export const CloseIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
);

export const ArrowRightIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" />
  </Icon>
);

export const ExternalIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M13 5h6v6" />
    <path d="M19 5 10 14" />
    <path d="M18.5 14.5v3a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2v-10a2 2 0 0 1 2-2h3" />
  </Icon>
);

export const CheckIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m4.5 12.5 5 5 10-11" />
  </Icon>
);

export const GlobeIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3.5 9.5h17M3.5 14.5h17" />
    <path d="M12 3c2.4 2.6 3.6 5.6 3.6 9s-1.2 6.4-3.6 9c-2.4-2.6-3.6-5.6-3.6-9S9.6 5.6 12 3Z" />
  </Icon>
);

export const StarIcon = (props: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    width={18}
    height={18}
    {...props}
  >
    <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5-5.9-3.2-5.9 3.2 1.2-6.5L2.5 9.4l6.6-.9 2.9-6Z" />
  </svg>
);

export const WhatsAppIcon = (props: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    width={20}
    height={20}
    {...props}
  >
    <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.9.54 3.68 1.48 5.2L2 22.5l5.6-1.62a9.8 9.8 0 0 0 4.44 1.06c5.44 0 9.84-4.4 9.84-9.84C21.88 6.4 17.48 2 12.04 2Zm0 17.9c-1.5 0-2.9-.4-4.1-1.12l-.3-.18-3.06.88.86-3-.2-.32a7.98 7.98 0 0 1-1.24-4.32c0-4.42 3.6-8.02 8.04-8.02 4.42 0 8.02 3.6 8.02 8.02 0 4.44-3.6 8.06-8.02 8.06Zm4.42-5.98c-.24-.12-1.44-.7-1.66-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1-.36-1.9-1.16-.7-.62-1.18-1.4-1.32-1.64-.14-.24-.02-.38.1-.5.12-.12.26-.3.4-.46.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.32-.74-1.8-.2-.48-.4-.4-.54-.4h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.68 2.68 4.1 3.66 2.02.82 2.42.66 2.86.62.44-.04 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
  </svg>
);

export const FacebookIcon = (props: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    width={20}
    height={20}
    {...props}
  >
    <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.3-.04-1.3-.13-2.5-.13-2.45 0-4.15 1.5-4.15 4.25V9.9H7.4V13h2.65v8h3.45Z" />
  </svg>
);

export const InstagramIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="3.8" />
    <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
  </Icon>
);

export const CameraIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4.5 8.5h2.2l1.3-2h8l1.3 2H19.5A1.5 1.5 0 0 1 21 10v8.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5V10a1.5 1.5 0 0 1 1.5-1.5Z" />
    <circle cx="12" cy="14" r="3.2" />
  </Icon>
);
