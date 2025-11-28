import React from "react";

interface ArrowUpIconProps extends React.SVGProps<SVGSVGElement> {
  size?: string;
  color?: string;
}
export const ArrowUpIcon: React.FunctionComponent<ArrowUpIconProps> = ({
  size = "20",
  color = "#5F738C",
  ...otherSvgProps
}) => {
  return (
    <svg
    data-testid="arrow-up"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      {...otherSvgProps}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.49979 13.3335C2.49979 13.1201 2.58146 12.9068 2.74396 12.7443L9.41063 6.07762C9.73646 5.75179 10.2631 5.75179 10.589 6.07762L17.2556 12.7443C17.5815 13.0701 17.5815 13.5968 17.2556 13.9226C16.9298 14.2485 16.4031 14.2485 16.0773 13.9226L9.99979 7.84512L3.9223 13.9226C3.59646 14.2485 3.06979 14.2485 2.74396 13.9226C2.58146 13.7601 2.49979 13.5468 2.49979 13.3335Z"
        fill={color}
      />
    </svg>
  );
};
