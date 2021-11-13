import React from "react";
import PropTypes from "prop-types";

const NameIcon = (props) => {
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
            d="M41.6667 37.4999C41.6667 32.8975 45.3976 29.1665 50 29.1665C54.6024 29.1665 58.3333 32.8975 58.3333 37.4999C58.3333 42.1022 54.6024 45.8332 50 45.8332C45.3976 45.8332 41.6667 42.1022 41.6667 37.4999Z"
            fill="white"
          />
          <path
            d="M45.8333 52.0832C38.9298 52.0832 33.3333 57.6796 33.3333 64.5832C33.3333 66.8844 35.1988 68.7499 37.5 68.7499H62.5C64.8012 68.7499 66.6667 66.8844 66.6667 64.5832C66.6667 57.6796 61.0702 52.0832 54.1667 52.0832H45.8333Z"
            fill="white"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M31.4314 12.011C43.7472 10.2413 56.2528 10.2413 68.5687 12.011C74.6749 12.8885 79.3795 17.8443 79.9383 23.9878L80.4674 29.8034C81.6897 43.24 81.6897 56.7598 80.4674 70.1963L79.9383 76.0119C79.3795 82.1555 74.6749 87.1112 68.5687 87.9887C56.2528 89.7585 43.7472 89.7585 31.4314 87.9887C25.3251 87.1112 20.6206 82.1555 20.0617 76.0119L19.5327 70.1963C18.3104 56.7598 18.3104 43.24 19.5327 29.8034L20.0617 23.9878C20.6206 17.8443 25.3251 12.8885 31.4314 12.011ZM67.6797 18.1975C55.9535 16.5125 44.0466 16.5125 32.3203 18.1975C29.0795 18.6632 26.5826 21.2934 26.286 24.5541L25.757 30.3696C24.569 43.4295 24.569 56.5703 25.757 69.6301L26.286 75.4457C26.5826 78.7063 29.0795 81.3365 32.3203 81.8022C44.0466 83.4873 55.9535 83.4873 67.6797 81.8022C70.9205 81.3365 73.4174 78.7063 73.714 75.4457L74.2431 69.6301C75.4311 56.5702 75.4311 43.4295 74.2431 30.3696L73.714 24.5541C73.4174 21.2934 70.9205 18.6632 67.6797 18.1975Z"
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
            d="M68.5687 12.011C56.2528 10.2413 43.7472 10.2413 31.4314 12.011C25.3252 12.8885 20.6206 17.8443 20.0617 23.9878L19.5327 29.8034C18.3104 43.24 18.3104 56.7598 19.5327 70.1963L20.0617 76.0119C20.6206 82.1555 25.3252 87.1112 31.4314 87.9887C43.7472 89.7585 56.2528 89.7585 68.5687 87.9887C74.6749 87.1112 79.3795 82.1555 79.9383 76.0119L80.4674 70.1963C81.6897 56.7598 81.6897 43.24 80.4674 29.8034L79.9383 23.9878C79.3795 17.8443 74.6749 12.8885 68.5687 12.011ZM41.6667 37.4999C41.6667 32.8975 45.3976 29.1666 50 29.1666C54.6024 29.1666 58.3333 32.8975 58.3333 37.4999C58.3333 42.1023 54.6024 45.8332 50 45.8332C45.3976 45.8332 41.6667 42.1023 41.6667 37.4999ZM33.3333 64.5832C33.3333 57.6797 38.9298 52.0832 45.8333 52.0832H54.1667C61.0702 52.0832 66.6667 57.6797 66.6667 64.5832C66.6667 66.8844 64.8012 68.7499 62.5 68.7499H37.5C35.1988 68.7499 33.3333 66.8844 33.3333 64.5832Z"
            fill={props.focusedColor}
          />
        </svg>
      </div>
    );
  }
};

NameIcon.propTypes = {
  style: PropTypes.object,
  focused: PropTypes.bool,
  focusedColor: PropTypes.string,
};

export default NameIcon;
