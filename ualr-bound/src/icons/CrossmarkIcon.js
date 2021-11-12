import React from "react";
import PropTypes from "prop-types";

const CrossmarkIcon = (props) => {
  if (!props.focused) {
    return (
      <div
        className="decision-button-cross-container"
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
            d="M50.2055 28.1088C51.1208 27.1935 51.1208 25.7095 50.2055 24.7942C49.2903 23.8789 47.8063 23.8789 46.891 24.7942L37.4997 34.1854L28.1085 24.7942C27.1932 23.8789 25.7092 23.8789 24.7939 24.7942C23.8786 25.7095 23.8786 27.1935 24.7939 28.1088L34.1852 37.5L24.7939 46.8913C23.8786 47.8066 23.8786 49.2906 24.7939 50.2058C25.7092 51.1211 27.1932 51.1211 28.1085 50.2058L37.4997 40.8146L46.891 50.2058C47.8063 51.1211 49.2903 51.1211 50.2056 50.2058C51.1209 49.2906 51.1209 47.8066 50.2056 46.8913L40.8143 37.5L50.2055 28.1088Z"
            fill="#E8372B"
          />
        </svg>
      </div>
    );
  } else {
    return (
      <div
        className="decision-button-cross-container"
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
            d="M50.2055 28.1088C51.1208 27.1935 51.1208 25.7095 50.2055 24.7942C49.2903 23.8789 47.8063 23.8789 46.891 24.7942L37.4997 34.1854L28.1085 24.7942C27.1932 23.8789 25.7092 23.8789 24.7939 24.7942C23.8786 25.7095 23.8786 27.1935 24.7939 28.1088L34.1852 37.5L24.7939 46.8913C23.8786 47.8066 23.8786 49.2906 24.7939 50.2058C25.7092 51.1211 27.1932 51.1211 28.1085 50.2058L37.4997 40.8146L46.891 50.2058C47.8063 51.1211 49.2903 51.1211 50.2056 50.2058C51.1209 49.2906 51.1209 47.8066 50.2056 46.8913L40.8143 37.5L50.2055 28.1088Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    );
  }
};

CrossmarkIcon.propTypes = {
  onClick: PropTypes.func,
};

export default CrossmarkIcon;
