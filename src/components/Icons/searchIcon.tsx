import React from "react";

interface SearchIconProps extends React.SVGProps<SVGSVGElement> {
  size?: string;
  color?: string;
}


export const SearchIcon: React.FunctionComponent<SearchIconProps> = ({
    size = "24",
    color = "#5F738C",
    ...otherSvgProps
  }) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 12 12"
        fill="none"
        {...otherSvgProps}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.5 1.00156C7.98528 1.00156 10 3.01628 10 5.50156C10 6.56395 9.63185 7.54036 9.01615 8.31015L10.8536 10.148C11.0488 10.3433 11.0488 10.6599 10.8536 10.8551C10.6733 11.0354 10.3897 11.0492 10.1936 10.8967L10.1464 10.8551L8.30859 9.01772C7.53879 9.63341 6.56239 10.0016 5.5 10.0016C3.01472 10.0016 1 7.98685 1 5.50156C1 3.01628 3.01472 1.00156 5.5 1.00156ZM5.4999 2C3.56691 2 1.9999 3.56701 1.9999 5.5C1.9999 7.433 3.56691 9 5.4999 9C7.4329 9 8.9999 7.433 8.9999 5.5C8.9999 3.56701 7.4329 2 5.4999 2Z"
          fill={color}
        />
      </svg>
    );
  };
  