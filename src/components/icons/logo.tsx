import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M11 20A7 7 0 0 1 4 13" />
      <path d="M11 20A7 7 0 0 0 18 13" />
      <path d="M11 20V3" />
      <path d="M13.5 17.4a4.5 4.5 0 1 0-5 0" />
      <path d="M11 3L6 8" />
      <path d="M11 3l5 5" />
    </svg>
  );
}
