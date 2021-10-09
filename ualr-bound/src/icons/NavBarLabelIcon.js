import React from "react";
import PropTypes from "prop-types";

const NavBarLabelIcon = (props) => {
  let classname = props.isFocused ? "icon-svg focused" : "icon-svg";
  return (
    <div style={props.style} id={props.id}>
      <svg
        className={classname}
        width="146"
        height="77"
        viewBox="0 0 146 77"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d)">
          <g>
            <rect x="4" width="138" height="59" rx="25" fill="white" />
            <text
              x="50%"
              y="40%"
              dominant-baseline="middle"
              text-anchor="middle"
              fill="black"
              font-size="1.25em"
            >
              {props.text}
            </text>
          </g>
          <path
            d="M75.3301 66.5C73.4056 69.8333 68.5944 69.8333 66.6699 66.5L62.3397 59C60.4152 55.6667 62.8209 51.5 66.6699 51.5H75.3301C79.1791 51.5 81.5848 55.6667 79.6603 59L75.3301 66.5Z"
            fill="white"
          />
        </g>
        <defs>
          <filter
            id="filter0_d"
            x="0"
            y="0"
            width="146"
            height="77"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

NavBarLabelIcon.propTypes = {
  id: PropTypes.number,
  isFocused: PropTypes.bool,
  text: PropTypes.string.isRequired,
  style: PropTypes.object,
  svgStyle: PropTypes.object,
};

export default NavBarLabelIcon;
