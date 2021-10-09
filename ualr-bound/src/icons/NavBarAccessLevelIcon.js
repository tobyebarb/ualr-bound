import React from "react";
import PropTypes from "prop-types";

const NavBarAccessLevelIcon = (props) => {
  return (
    <div style={props.style} id={props.id}>
      <svg
        width="50"
        height="50"
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="icon"
      >
        <path
          d="M27.4181 9.1814C25.9305 8.28564 24.0696 8.28564 22.582 9.1814L21.5064 9.82909C18.8965 11.4006 15.9665 12.365 12.9334 12.6507L12.2558 12.7146C10.9181 12.8406 9.89587 13.9637 9.89587 15.3073V18.732C9.89587 24.5208 12.2461 30.0616 16.408 34.0851L23.19 40.6413C24.1994 41.6171 25.8006 41.6171 26.81 40.6413L33.592 34.0851C37.754 30.0616 40.1042 24.5208 40.1042 18.732V15.3073C40.1042 13.9637 39.082 12.8406 37.7443 12.7146L37.0666 12.6507C34.0336 12.365 31.1036 11.4006 28.4937 9.82909L27.4181 9.1814Z"
          fill="white"
        />
      </svg>
    </div>
  );
};

NavBarAccessLevelIcon.propTypes = {
  id: PropTypes.number,
  style: PropTypes.object,
  svgStyle: PropTypes.object,
};

export default NavBarAccessLevelIcon;
