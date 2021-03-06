import React from "react";
import PropTypes from "prop-types";

const SearchIcon = (props) => {
  if (!props.focused) {
    return (
      <div className="search-icon-container" style={props.style}>
        <svg
          width="50"
          height="50"
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="search-icon"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M29.9691 32.1786C24.4477 36.6008 16.3655 36.2528 11.2472 31.1345C5.75548 25.6427 5.75548 16.7388 11.2472 11.2471C16.739 5.75533 25.6429 5.75533 31.1346 11.2471C36.2529 16.3654 36.601 24.4475 32.1788 29.9689L42.9197 40.7098C43.5299 41.32 43.5299 42.3093 42.9197 42.9195C42.3095 43.5297 41.3202 43.5297 40.71 42.9195L29.9691 32.1786ZM13.4569 28.9247C9.18558 24.6534 9.18558 17.7281 13.4569 13.4568C17.7283 9.18543 24.6535 9.18543 28.9249 13.4568C33.1931 17.725 33.1963 24.6432 28.9343 28.9153C28.9311 28.9184 28.928 28.9216 28.9249 28.9247C28.9217 28.9278 28.9186 28.931 28.9155 28.9341C24.6434 33.1961 17.7252 33.193 13.4569 28.9247Z"
            fill="#393939"
          />
        </svg>
      </div>
    );
  } else {
    return (
      <div className="search-icon-container" style={props.style}>
        <svg
          width="50"
          height="50"
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="search-icon"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M29.9691 32.1786C24.4477 36.6008 16.3655 36.2528 11.2472 31.1345C5.75548 25.6427 5.75548 16.7388 11.2472 11.2471C16.739 5.75533 25.6429 5.75533 31.1346 11.2471C36.2529 16.3654 36.601 24.4475 32.1788 29.9689L42.9197 40.7098C43.5299 41.32 43.5299 42.3093 42.9197 42.9195C42.3095 43.5297 41.3202 43.5297 40.71 42.9195L29.9691 32.1786ZM13.4569 28.9247C9.18558 24.6534 9.18558 17.7281 13.4569 13.4568C17.7283 9.18543 24.6535 9.18543 28.9249 13.4568C33.1931 17.725 33.1963 24.6432 28.9343 28.9153C28.9311 28.9184 28.928 28.9216 28.9249 28.9247C28.9217 28.9278 28.9186 28.931 28.9155 28.9341C24.6434 33.1961 17.7252 33.193 13.4569 28.9247Z"
            fill={props.focusedColor}
          />
        </svg>
      </div>
    );
  }
};

SearchIcon.propTypes = {
  style: PropTypes.object,
  svgStyle: PropTypes.object,
  focused: PropTypes.bool,
  focusedColor: PropTypes.string,
};

export default SearchIcon;
