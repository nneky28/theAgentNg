import React from "react";

interface PlayIconProps extends React.SVGProps<SVGSVGElement> {
  size?: string;
  color?: string;
}
export const PlayIcon: React.FunctionComponent<PlayIconProps> = ({
  color = "#5F738C",
  ...otherSvgProps
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      data-testid="play-icon"
      color={color}
      {...otherSvgProps}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.5C17.5228 2.5 22 6.97715 22 12.5C22 18.0228 17.5228 22.5 12 22.5C6.47715 22.5 2 18.0228 2 12.5C2 6.97715 6.47715 2.5 12 2.5ZM12 4.5C7.58172 4.5 4 8.08172 4 12.5C4 16.9183 7.58172 20.5 12 20.5C16.4183 20.5 20 16.9183 20 12.5C20 8.08172 16.4183 4.5 12 4.5ZM10.5039 7.63622L16.5039 11.6362C17.1265 11.9994 17.1631 12.8674 16.6137 13.29L10.5039 17.3638C9.83721 17.7527 9 17.2718 9 16.5V8.5C9 7.72821 9.83721 7.24734 10.5039 7.63622Z"
        fill="#0275D8"
      />
    </svg>
  );
};
