import React from "react";
import PropTypes from "prop-types";

const CallNotesIcon = (props) => {
  if (!props.focused) {
    return (
      <div style={props.style}>
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
            d="M19.1324 63.7676C9.76632 40.7781 26.6793 15.625 51.5035 15.625H52.8428C71.4079 15.625 86.4579 30.675 86.4579 49.2402C86.4579 69.9103 69.7015 86.6667 49.0315 86.6667H16.447C15.1209 86.6667 13.9392 85.8297 13.4991 84.5788C13.059 83.3279 13.4563 81.9355 14.4902 81.1051L22.7047 74.5081C23.0639 74.2197 23.191 73.7295 23.0172 73.3029L19.1324 63.7676ZM51.5035 21.875C31.1179 21.875 17.2291 42.5306 24.9205 61.4095L28.8052 70.9448C30.0219 73.9312 29.1325 77.362 26.6183 79.3812L25.3289 80.4167H49.0315C66.2497 80.4167 80.2079 66.4585 80.2079 49.2402C80.2079 34.1268 67.9561 21.875 52.8428 21.875H51.5035Z"
            fill="white"
          />
        </svg>
      </div>
    );
  } else {
    return (
      <div style={props.style}>
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="icon"
        >
          <path
            d="M51.5037 16.6667C27.4193 16.6667 11.0104 41.0702 20.0974 63.3746L23.9821 72.9099C24.3297 73.7631 24.0756 74.7434 23.3573 75.3203L15.1427 81.9173C14.4534 82.4708 14.1886 83.3992 14.482 84.2331C14.7754 85.067 15.5632 85.625 16.4472 85.625H49.0317C69.1265 85.625 85.4165 69.3349 85.4165 49.2402C85.4165 31.2503 70.8329 16.6667 52.843 16.6667H51.5037Z"
            fill={props.focusedColor}
          />
        </svg>
      </div>
    );
  }
};

CallNotesIcon.propTypes = {
  style: PropTypes.object,
  focused: PropTypes.bool,
  focusedColor: PropTypes.string,
  invalidFocusColor: PropTypes.string,
  invalid: PropTypes.bool,
};

export default CallNotesIcon;
