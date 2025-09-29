
import type { SVGProps } from "react";

export default function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07C1.86 17.09 5.87 21.17 10.68 21.95v-6.94H8.2v-2.99h2.48V9.77c0-2.45 1.46-3.8 3.7-3.8 1.07 0 2.19.19 2.19.19v2.41h-1.24c-1.22 0-1.6.76-1.6 1.54v1.86h2.72l-.43 2.99h-2.29v6.94C18.13 21.17 22 17.09 22 12.07z" />
    </svg>
  );
}
