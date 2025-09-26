import type { SVGProps } from "react";

export function MessengerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24"
        fill="currentColor"
        strokeWidth="0"
        {...props}
    >
        <path d="M12 2C6.48 2 2 6.04 2 11.53c0 3.34 1.96 6.25 4.78 7.64.28.08.57.1.85.03.35-.09.68-.26.96-.5l2.25-1.93a.49.49 0 0 1 .6-.05c2.31 1.43 5.23 1.43 7.54 0a.49.49 0 0 1 .6.05l2.25 1.93c.28.24.61.41.96.5.28.07.57.05.85-.03C20.04 17.78 22 14.87 22 11.53 22 6.04 17.52 2 12 2zM8.5 13.5l3-4.5 3 4.5h-6z"/>
    </svg>
  );
}
