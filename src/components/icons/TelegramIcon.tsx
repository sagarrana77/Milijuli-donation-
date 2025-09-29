
import type { SVGProps } from "react";

export default function TelegramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        {...props}
    >
        <path d="M22.5 2.5L1.5 10.5c-.5.17-.48.83.03.97L6 13.5l3.67 1.61c.52.23 1.08-.09 1.09-.65L11 10.5l8.33-6.33c.46-.35 1.09-.03 1.17.59.07.62-.26 1.22-.67 1.74L15.5 12l5 2.5c.64.32 1.02-.34.61-.96L12.5 3.5l10-1z" />
    </svg>
  );
}
