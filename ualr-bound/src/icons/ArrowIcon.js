import React from "react";
import PropTypes from "prop-types";

const ArrowIcon = (props) => {
  return (
    <div className="icon-div" style={props.style} onClick={props.onClick}>
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="icon"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M58.4597 68.8764C57.2393 70.0968 55.2607 70.0968 54.0403 68.8764L37.3736 52.2097C36.1532 50.9893 36.1532 49.0107 37.3736 47.7903L54.0403 31.1236C55.2607 29.9032 57.2393 29.9032 58.4597 31.1236C59.6801 32.344 59.6801 34.3226 58.4597 35.543L44.0028 50L58.4597 64.4569C59.6801 65.6773 59.6801 67.656 58.4597 68.8764Z"
          fill="white"
        />
      </svg>
    </div>
  );
};

ArrowIcon.propTypes = {
  style: PropTypes.object,
  onClick: PropTypes.func,
};

export default ArrowIcon;
