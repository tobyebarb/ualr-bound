import React from "react";
import PropTypes from "prop-types";

const StudentsIcon = (props) => {
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
            d="M34.375 33.3333C34.375 31.6074 35.7741 30.2083 37.5 30.2083H66.6667C68.3926 30.2083 69.7917 31.6074 69.7917 33.3333C69.7917 35.0592 68.3926 36.4583 66.6667 36.4583H37.5C35.7741 36.4583 34.375 35.0592 34.375 33.3333Z"
            fill="white"
          />
          <path
            d="M37.5 42.7083C35.7741 42.7083 34.375 44.1074 34.375 45.8333C34.375 47.5592 35.7741 48.9583 37.5 48.9583H58.3333C60.0592 48.9583 61.4583 47.5592 61.4583 45.8333C61.4583 44.1074 60.0592 42.7083 58.3333 42.7083H37.5Z"
            fill="white"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M35.4167 13.5417C24.486 13.5417 15.625 22.4027 15.625 33.3333V75C15.625 83.6294 22.6205 90.625 31.25 90.625H77.0833C81.1104 90.625 84.375 87.3604 84.375 83.3333V20.8333C84.375 16.8062 81.1104 13.5417 77.0833 13.5417H35.4167ZM78.125 59.375V20.8333C78.125 20.258 77.6586 19.7917 77.0833 19.7917H35.4167C27.9378 19.7917 21.875 25.8545 21.875 33.3333V62.4988C24.4864 60.5373 27.7325 59.375 31.25 59.375H78.125ZM78.125 65.625H31.25C26.0723 65.625 21.875 69.8223 21.875 75C21.875 80.1777 26.0723 84.375 31.25 84.375H77.0833C77.6586 84.375 78.125 83.9086 78.125 83.3333V65.625Z"
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
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M16.6666 33.3333C16.6666 22.978 25.0613 14.5833 35.4166 14.5833H77.0833C80.5351 14.5833 83.3333 17.3816 83.3333 20.8333V83.3333C83.3333 85.6345 81.4678 87.5 79.1666 87.5H31.25C23.9031 87.5 17.8252 82.0673 16.8143 75H16.6666V33.3333ZM77.0833 64.5833H31.25C26.6476 64.5833 22.9166 68.3143 22.9166 72.9167C22.9166 77.519 26.6476 81.25 31.25 81.25H77.0833V64.5833ZM34.375 33.3333C34.375 31.6075 35.7741 30.2083 37.5 30.2083H66.6666C68.3925 30.2083 69.7916 31.6075 69.7916 33.3333C69.7916 35.0592 68.3925 36.4583 66.6666 36.4583H37.5C35.7741 36.4583 34.375 35.0592 34.375 33.3333ZM37.5 42.7083C35.7741 42.7083 34.375 44.1075 34.375 45.8333C34.375 47.5592 35.7741 48.9583 37.5 48.9583H58.3333C60.0592 48.9583 61.4583 47.5592 61.4583 45.8333C61.4583 44.1075 60.0592 42.7083 58.3333 42.7083H37.5Z"
            fill={props.focusedColor}
          />
        </svg>
      </div>
    );
  }
};

StudentsIcon.propTypes = {
  style: PropTypes.object,
  svgStyle: PropTypes.object,
  focused: PropTypes.bool,
  focusedColor: PropTypes.string,
};

export default StudentsIcon;
