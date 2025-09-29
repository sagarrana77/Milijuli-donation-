
import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
  color?: string;
  title?: string;
};

const MessengerIcon: React.FC<IconProps> = ({
  size = 24,
  color = 'currentColor',
  title = 'Messenger',
  ...props
}) => (
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
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 16.12 4.47 19.58 8.19 21.05C8.63 21.22 9.11 20.94 9.11 20.47V17.07C9.11 16.59 9.49 16.21 9.97 16.21H12.5C17.75 16.21 22 12.43 22 7.71C22 4.56 17.52 2 12 2ZM11.25 12.33H8.75V9.83H11.25V12.33ZM15.25 12.33H12.75V9.83H15.25V12.33Z"
      fill={color}
    />
  </svg>
);

export default MessengerIcon;
