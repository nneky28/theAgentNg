import React from "react";

interface WaveIconProps extends React.SVGProps<SVGSVGElement> {
  size?: string;
  color?: string;
}
export const WaveIcon: React.FunctionComponent<WaveIconProps> = ({
  color = "#5F738C",
  ...otherSvgProps
}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="57" height="25" viewBox="0 0 57 25" fill="none" {...otherSvgProps} color={color}>
  <line x1="0.5" y1="9.5" x2="0.5" y2="15.5" stroke="#0275D8" strokeLinecap="round"/>
  <line x1="2.5" y1="8.5" x2="2.5" y2="16.5" stroke="#0275D8" strokeLinecap="round"/>
  <line x1="4.5" y1="7.5" x2="4.5" y2="17.5" stroke="#0275D8" strokeLinecap="round"/>
  <line x1="6.5" y1="3.5" x2="6.5" y2="20.5" stroke="#0275D8" strokeLinecap="round"/>
  <line x1="8.5" y1="6.5" x2="8.5" y2="17.5" stroke="#0275D8" strokeLinecap="round"/>
  <line x1="10.5" y1="9.5" x2="10.5" y2="15.5" stroke="#0275D8" strokeLinecap="round"/>
  <line x1="12.5" y1="6.5" x2="12.5" y2="18.5" stroke="#0275D8" strokeLinecap="round"/>
  <line x1="14.5" y1="5.5" x2="14.5" y2="19.5" stroke="#0275D8" strokeLinecap="round"/>
  <line x1="16.5" y1="7.5" x2="16.5" y2="17.5" stroke="#0275D8" strokeLinecap="round"/>
  <line x1="18.5" y1="9.5" x2="18.5" y2="15.5" stroke="#0275D8" strokeLinecap="round"/>
  <line x1="20.5" y1="5.5" x2="20.5" y2="19.5" stroke="#0275D8" strokeLinecap="round"/>
  <line x1="22.5" y1="9.5" x2="22.5" y2="15.5" stroke="#0275D8" strokeLinecap="round"/>
  <line x1="24.5" y1="6.5" x2="24.5" y2="19.5" stroke="#0275D8" strokeLinecap="round"/>
  <line x1="26.5" y1="4.5" x2="26.5" y2="20.5" stroke="#0275D8" strokeLinecap="round"/>
  <line x1="28.5" y1="6.5" x2="28.5" y2="18.5" stroke="#0275D8" strokeLinecap="round"/>
  <line x1="30.5" y1="8.5" x2="30.5" y2="16.5" stroke="#0275D8" strokeLinecap="round"/>
  <line x1="32.5" y1="6.5" x2="32.5" y2="19.5" stroke="#0275D8" strokeLinecap="round"/>
  <line x1="34.5" y1="4.5" x2="34.5" y2="20.5" stroke="#0275D8" strokeLinecap="round"/>
  <line x1="36.5" y1="0.5" x2="36.5" y2="24.5" stroke="#0275D8" strokeLinecap="round"/>
  <line x1="38.5" y1="4.5" x2="38.5" y2="20.5" stroke="#0275D8" strokeLinecap="round"/>
  <line x1="40.5" y1="6.5" x2="40.5" y2="18.5" stroke="#0275D8" strokeLinecap="round"/>
  <line x1="42.5" y1="8.5" x2="42.5" y2="15.5" stroke="#0275D8" strokeLinecap="round"/>
  <line x1="44.5" y1="6.5" x2="44.5" y2="19.5" stroke="#0275D8" strokeLinecap="round"/>
  <line x1="46.5" y1="8.5" x2="46.5" y2="17.5" stroke="#0275D8" strokeLinecap="round"/>
  <line x1="48.5" y1="10.5" x2="48.5" y2="16.5" stroke="#0275D8" strokeLinecap="round"/>
  <line x1="50.5" y1="3.5" x2="50.5" y2="22.5" stroke="#0275D8" strokeLinecap="round"/>
  <line x1="52.5" y1="6.5" x2="52.5" y2="18.5" stroke="#0275D8" strokeLinecap="round"/>
  <line x1="54.5" y1="5.5" x2="54.5" y2="20.5" stroke="#0275D8" strokeLinecap="round"/>
  <line x1="56.5" y1="8.5" x2="56.5" y2="16.5" stroke="#0275D8" strokeLinecap="round"/>
</svg>
  );
};
