import React from "react";
import PropTypes from "prop-types";
import {useHistory} from "react-router-dom"

const AnalyticsIcon = (props) => {

  const history = useHistory();
  const redirect = () =>{
    history.push("/analytics")
  }

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
            d="M46.875 15.7651C29.3547 17.344 15.625 32.0686 15.625 50C15.625 68.9848 31.0152 84.375 50 84.375C59.6724 84.375 68.4106 80.3831 74.6603 73.9482L48.0357 52.4305C47.3016 51.8372 46.875 50.9439 46.875 50V15.7651ZM53.125 15.7651V46.875H84.2349C82.7488 30.3839 69.6161 17.2512 53.125 15.7651ZM84.235 53.125H58.8382L78.5919 69.0897C81.7009 64.4434 83.7062 58.9988 84.235 53.125ZM9.375 50C9.375 27.5634 27.5634 9.375 50 9.375C72.4366 9.375 90.625 27.5634 90.625 50C90.625 59.6716 87.2413 68.5615 81.5959 75.538C74.1533 84.7355 62.7633 90.625 50 90.625C27.5634 90.625 9.375 72.4366 9.375 50Z"
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
            d="M46.875 11.4392C46.875 10.9534 46.4587 10.5699 45.9754 10.6187C26.0044 12.6354 10.4166 29.4973 10.4166 50C10.4166 71.8613 28.1387 89.5833 50 89.5833C60.9863 89.5833 70.928 85.1057 78.0975 77.8813C78.44 77.5361 78.4022 76.9724 78.024 76.6668L48.0357 52.4305C47.3016 51.8372 46.875 50.9439 46.875 50V11.4392Z"
            fill={props.focusedColor}
          />
          <path
            d="M81.956 71.8086C82.3339 72.114 82.8926 72.0331 83.1584 71.6264C86.5295 66.4675 88.7299 60.4727 89.3813 54.0226C89.4301 53.5393 89.0465 53.125 88.5607 53.125H61.1951C60.4094 53.125 60.0602 54.1126 60.6713 54.6065L81.956 71.8086Z"
            fill={props.focusedColor}
          />
          <path
            d="M88.5608 46.875C89.0466 46.875 89.4301 46.459 89.3812 45.9756C87.4983 27.3279 72.6721 12.5016 54.0243 10.6187C53.541 10.5699 53.125 10.9534 53.125 11.4392V45.625C53.125 46.3154 53.6846 46.875 54.375 46.875H88.5608Z"
            fill={props.focusedColor}
          />
        </svg>
      </div>
    );
  }
};

AnalyticsIcon.propTypes = {
  style: PropTypes.object,
  focused: PropTypes.bool,
  focusedColor: PropTypes.string,
};

export default AnalyticsIcon;
