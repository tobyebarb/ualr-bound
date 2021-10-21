import React from "react";
import PropTypes from "prop-types";

const CheckmarkIcon = (props) => {
  if (!props.focused) {
    return (
      <div
        className="decision-button-check-container"
        style={props.style}
        onClick={() => props.onClick()}
      >
        <svg
          width="75"
          height="75"
          viewBox="0 0 75 75"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="decision-button-check-path"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M56.3448 24.9052C57.2601 25.8205 57.2601 27.3045 56.3448 28.2198L34.4698 50.0948C33.5545 51.0101 32.0705 51.0101 31.1552 50.0948L18.6552 37.5948C17.7399 36.6795 17.7399 35.1955 18.6552 34.2802C19.5705 33.3649 21.0545 33.3649 21.9698 34.2802L32.8125 45.1229L53.0302 24.9052C53.9455 23.9899 55.4295 23.9899 56.3448 24.9052Z"
            fill="#21D31D"
          />
        </svg>
      </div>
    );
  } else {
    return (
      <div
        className="decision-button-check-container"
        onClick={() => props.onClick()}
        style={props.style}
      >
        <svg
          width="75"
          height="75"
          viewBox="0 0 75 75"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="decision-button-check-path"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M56.3448 24.9052C57.2601 25.8205 57.2601 27.3045 56.3448 28.2198L34.4698 50.0948C33.5545 51.0101 32.0705 51.0101 31.1552 50.0948L18.6552 37.5948C17.7399 36.6795 17.7399 35.1955 18.6552 34.2802C19.5705 33.3649 21.0545 33.3649 21.9698 34.2802L32.8125 45.1229L53.0302 24.9052C53.9455 23.9899 55.4295 23.9899 56.3448 24.9052Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    );
  }
};

CheckmarkIcon.propTypes = {
  onClick: PropTypes.func,
};

export default CheckmarkIcon;
