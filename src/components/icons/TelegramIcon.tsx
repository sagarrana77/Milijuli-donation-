
import React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
  color?: string;
  title?: string;
};

const TelegramIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", title = "Telegram", ...props }) => (
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
    <path d="M22.5 2.5L1.5 10.5c-.5.17-.48.83.03.97L6 13.5l3.67 1.61c.52.23 1.08-.09 1.09-.65L11 10.5l8.33-6.33c.46-.35 1.09-.03 1.17.59.07.62-.26 1.22-.67 1.74L15.5 12l5 2.5c.64.32 1.02-.34.61-.96L12.5 3.5l10-1z" fill={color} />
  </svg>
);

export default TelegramIcon;
