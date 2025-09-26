import type { SVGProps } from "react";
import React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
  color?: string;
  title?: string;
};

const InstagramIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", title = "Instagram", ...props }) => (
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
    <rect x="2" y="2" width="20" height="20" rx="5" stroke={color} strokeWidth="1.5" />
    <path d="M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="17.5" cy="6.5" r="0.75" fill={color} />
  </svg>
);

export default InstagramIcon;