
import type { SVGProps } from "react";

export default function YouTubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        {...props}
    >
        <path d="M23 7.1a3 3 0 00-2.12-2.13C19.46 4.5 12 4.5 12 4.5s-7.46 0-8.88.47A3 3 0 001.02 7.1C.5 8.53.5 12 .5 12s0 3.47.52 4.9a3 3 0 002.1 2.13C4.54 19.5 12 19.5 12 19.5s7.46 0 8.88-.47a3 3 0 002.1-2.13c.52-1.43.52-4.9.52-4.9s0-3.47-.52-4.9zM9.8 15.2V8.8L15.6 12l-5.8 3.2z" />
    </svg>
  );
}
