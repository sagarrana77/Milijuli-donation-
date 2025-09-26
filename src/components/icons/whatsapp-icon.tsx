import type { SVGProps } from "react";
import React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
  color?: string;
  title?: string;
};

const WhatsAppIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", title = "WhatsApp", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
    aria-label={title}
    role="img"
    {...props}
  >
    <title>{title}</title>
    <path
      d="M12 2.04C6.5 2.04 2 6.53 2 12.06c0 5.52 4.5 10.02 10 10.02s10-4.5 10-10.02c0-5.53-4.5-10.02-10-10.02zm0 18.02c-4.43 0-8-3.57-8-8 0-4.43 3.57-8 8-8s8 3.57 8 8c0 4.43-3.57 8-8 8zm4.78-5.38c-.28-.14-1.64-.81-1.9-1.04-.25-.23-.43-.36-.62.36-.19.72-.72 1.44-.88 1.63-.16.19-.32.21-.59.07s-1.16-.42-2.2-1.35c-.81-.72-1.36-1.62-1.52-1.89-.16-.27-.02-.42.12-.56.13-.12.28-.31.42-.47.12-.14.16-.23.25-.39.09-.16.04-.3-.02-.42s-.61-1.45-.83-1.99c-.22-.54-.45-.47-.62-.47-.16 0-.34 0-.52 0s-.46.07-.7.36c-.24.29-.92 1.09-.92 2.65s.94 3.08 1.07 3.3.02 3.52 2.92 5.06c1.78.96 2.58 1.08 3.42.97.71-.1 1.45-.64 1.69-1.28.24-.64.24-1.18.16-1.28-.07-.11-.26-.18-.54-.32z"
    />
  </svg>
);

export default WhatsAppIcon;
