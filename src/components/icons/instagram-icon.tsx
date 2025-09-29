import type { SVGProps } from "react";

export default function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        {...props}
    >
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" />
        <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" />
    </svg>
  );
}
