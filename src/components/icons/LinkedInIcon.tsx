
import React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
  color?: string;
  title?: string;
};

const LinkedInIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", title = "LinkedIn", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label={title}
    role="img"
    {...props}
  >
    <title>{title}</title>
    <path d="M4.98 3.5a2.25 2.25 0 11-.001 4.5A2.25 2.25 0 014.98 3.5zM3.5 9h3v11h-3V9zM9.5 9h2.88v1.5h.04c.4-.76 1.37-1.56 2.82-1.56 3.02 0 3.58 1.99 3.58 4.58V20h-3v-4.03c0-.96-.02-2.2-1.34-2.2-1.34 0-1.55 1.05-1.55 2.12V20h-3V9z" fill={color} />
  </svg>
);

export default LinkedInIcon;
