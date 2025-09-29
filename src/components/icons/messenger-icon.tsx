
import type { SVGProps } from 'react';

export default function MessengerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        {...props}
    >
        <path d="M12 2C6.48 2 2 6.48 2 12c0 4.64 3.58 8.43 8.19 9.05.44.06.81-.22.81-.66v-2.45c0-.48.38-.86.86-.86h1.64c4.27 0 7.86-3.17 7.86-7.04C22 6.48 17.52 2 12 2zm-1.25 10.33H8.75V9.83h2.5v2.5zm4 0h-2.5V9.83h2.5v2.5z" />
    </svg>
  );
}
