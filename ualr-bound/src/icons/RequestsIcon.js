import React from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

const RequestsIcon = (props) => {
  const history = useHistory();

  const redirect = () => {
    history.push("/requests");
  };

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
            d="M41.6667 13.5418C31.8866 13.5418 23.9583 21.4701 23.9583 31.2501C23.9583 41.0302 31.8866 48.9585 41.6667 48.9585C51.4467 48.9585 59.375 41.0302 59.375 31.2501C59.375 21.4701 51.4467 13.5418 41.6667 13.5418ZM30.2083 31.2501C30.2083 24.9219 35.3384 19.7918 41.6667 19.7918C47.9949 19.7918 53.125 24.9219 53.125 31.2501C53.125 37.5784 47.9949 42.7085 41.6667 42.7085C35.3384 42.7085 30.2083 37.5784 30.2083 31.2501Z"
            fill="white"
          />
          <path
            d="M15.625 70.8335C15.625 65.6558 19.8223 61.4585 25 61.4585H26.4203C26.5301 61.4585 26.6392 61.4758 26.7436 61.5099L30.3499 62.6875C33.1813 63.612 36.0976 64.1806 39.0335 64.3931C39.6513 64.4379 40.1936 64.004 40.3332 63.4005C40.648 62.0392 41.0582 60.7144 41.5563 59.4335C41.7762 58.868 41.363 58.2429 40.7566 58.2246C37.8958 58.1384 35.0443 57.6456 32.2899 56.7462L28.6836 55.5686C27.9529 55.33 27.189 55.2085 26.4203 55.2085H25C16.3706 55.2085 9.375 62.204 9.375 70.8335V75.7846C9.375 78.9231 11.6495 81.5991 14.747 82.1048C23.7392 83.5729 32.8216 84.3006 41.9031 84.2877C42.5369 84.2868 42.9349 83.6023 42.6513 83.0355C42.0394 81.8129 41.5109 80.5413 41.0733 79.2281C40.8393 78.5258 40.1953 78.0328 39.4551 78.0227C31.5269 77.9136 23.6048 77.2182 15.754 75.9365C15.6796 75.9243 15.625 75.86 15.625 75.7846V70.8335Z"
            fill="white"
          />
          <path
            d="M71.875 63.75C71.875 62.0241 70.4759 60.625 68.75 60.625C67.0241 60.625 65.625 62.0241 65.625 63.75V71.1363C65.625 72.1361 66.1034 73.0756 66.912 73.6636L71.0786 76.6939C72.4744 77.709 74.4289 77.4005 75.444 76.0047C76.4591 74.6089 76.1505 72.6544 74.7547 71.6393L71.875 69.545V63.75Z"
            fill="white"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M68.75 92.9166C81.4065 92.9166 91.6667 82.6565 91.6667 70C91.6667 57.3434 81.4065 47.0833 68.75 47.0833C56.0935 47.0833 45.8333 57.3434 45.8333 70C45.8333 82.6565 56.0935 92.9166 68.75 92.9166ZM68.75 86.6666C77.9548 86.6666 85.4167 79.2047 85.4167 70C85.4167 60.7952 77.9548 53.3333 68.75 53.3333C59.5453 53.3333 52.0833 60.7952 52.0833 70C52.0833 79.2047 59.5453 86.6666 68.75 86.6666Z"
            fill="white"
          />
        </svg>
      </div>
    );
  } else {
    return (
      <div style={props.style} onClick={redirect}>
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="icon"
        >
          <path
            d="M41.6667 15.625C33.0372 15.625 26.0417 22.6206 26.0417 31.25C26.0417 39.8795 33.0372 46.875 41.6667 46.875C50.2961 46.875 57.2917 39.8795 57.2917 31.25C57.2917 22.6206 50.2961 15.625 41.6667 15.625Z"
            fill={props.focusedColor}
          />
          <path
            d="M25 55.2083C16.3706 55.2083 9.375 62.2039 9.375 70.8333V75.7845C9.375 78.923 11.6495 81.599 14.747 82.1047C23.9583 83.6086 33.2642 84.3354 42.567 84.2853C43.2174 84.2818 43.6108 83.5624 43.2926 82.995C40.9303 78.7823 39.5833 73.9235 39.5833 68.75C39.5833 65.4705 40.1246 62.3174 41.1227 59.3752C41.3102 58.8223 40.909 58.2343 40.3257 58.2084C37.6097 58.0878 34.906 57.6003 32.2899 56.7461L28.6836 55.5685C27.9529 55.3299 27.189 55.2083 26.4203 55.2083H25Z"
            fill={props.focusedColor}
          />
          <path
            d="M71.875 62.5C71.875 60.7741 70.4759 59.375 68.75 59.375C67.0241 59.375 65.625 60.7741 65.625 62.5V69.8864C65.625 70.8862 66.1034 71.8256 66.912 72.4137L71.0786 75.444C72.4744 76.4591 74.4289 76.1505 75.444 74.7547C76.4591 73.3589 76.1505 71.4045 74.7547 70.3894L71.875 68.295V62.5Z"
            fill={props.focusedColor}
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M68.75 91.6667C81.4065 91.6667 91.6667 81.4065 91.6667 68.75C91.6667 56.0935 81.4065 45.8333 68.75 45.8333C56.0935 45.8333 45.8333 56.0935 45.8333 68.75C45.8333 81.4065 56.0935 91.6667 68.75 91.6667ZM68.75 85.4167C77.9548 85.4167 85.4167 77.9548 85.4167 68.75C85.4167 59.5453 77.9548 52.0833 68.75 52.0833C59.5453 52.0833 52.0833 59.5453 52.0833 68.75C52.0833 77.9548 59.5453 85.4167 68.75 85.4167Z"
            fill={props.focusedColor}
          />
        </svg>
      </div>
    );
  }
};

RequestsIcon.propTypes = {
  style: PropTypes.object,
  svgStyle: PropTypes.object,
  focused: PropTypes.bool,
  focusedColor: PropTypes.string,
};

export default RequestsIcon;