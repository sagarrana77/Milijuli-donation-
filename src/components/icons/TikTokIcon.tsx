
import React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
  color?: string;
  title?: string;
};

const TikTokIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", title = "TikTok", ...props }) => (
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
    <path d="M9.5 3v10.58A4.92 4.92 0 0014.42 19 5 5 0 0019.5 14V12a5 5 0 01-5-5V6a6 6 0 01-5 2z" fill={color} />
  </svg>
);

export default TikTokIcon;
