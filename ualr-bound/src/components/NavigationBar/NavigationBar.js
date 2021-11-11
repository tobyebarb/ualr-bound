import React, { useContext, useState, useRef, useEffect } from "react";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import "./NavigationBar.css";
import * as constants from "../../utils/Constants";
import { Context } from "../../store/appContext";
import ImportIcon from "../../icons/ImportIcon";
import EditCallersIcon from "../../icons/EditCallersIcon";
import RequestsIcon from "../../icons/RequestsIcon";
import StudentsIcon from "../../icons/StudentsIcon";
import AnalyticsIcon from "../../icons/AnalyticsIcon";
import LogoutIcon from "../../icons/LogoutIcon";
import ArrowIcon from "../../icons/ArrowIcon";
import NavBarUserIcon from "../../icons/NavBarUserIcon";
import NavBarAccessLevelIcon from "../../icons/NavBarAccessLevelIcon";
import NavBarLabelIcon from "../../icons/NavBarLabelIcon";

const NavigationBar = () => {
  const { store, actions } = useContext(Context);
  const [collapseOffset, setCollapseOffset] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [editCallersFocused, setEditCallersFocused] = useState(false);
  const [requestsFocused, setRequestsFocused] = useState(false);
  const [studentsFocused, setStudentsFocused] = useState(false);
  const [analyticsFocused, setAnalyticsFocused] = useState(false);
  const [logoutFocused, setLogoutFocused] = useState(false);
  const [importFocused, setImportFocused] = useState(false);

  const setIconsFocus = (boolean) => {
    setEditCallersFocused(boolean);
    setRequestsFocused(boolean);
    setStudentsFocused(boolean);
    setAnalyticsFocused(boolean);
    setLogoutFocused(boolean);
    setImportFocused(boolean);
  };

  const svgContainerStyle = {
    // margin: "0.3rem",
    // marginRight: "1rem",
    // display: "flex",
    // float: "left",
  };

  const navWidthRef = useRef(null);
  const arrowWidthRef = useRef(null);
  const dividerWidthRef = useRef(null);

  useEffect(() => {
    setCollapseOffset(
      navWidthRef.current.offsetWidth -
        (arrowWidthRef.current.offsetWidth +
          dividerWidthRef.current.offsetWidth)
    );
  }, []);

  const svgStyle = {
    width: "50px",
    height: "50px",
  };

  const outerIconStyle = {
    display: "flex",
    alignItems: "center",
    // flexDirection: "column",
    // marginTop: "-65px",
  };

  const parseAccessLevelStr = (string) => {
    const capitalize = (str) => {
      if (typeof str === "string") {
        return str.replace(/^\w/, (c) => c.toUpperCase());
      } else {
        return "";
      }
    };
    return capitalize(string.split(".")[1]);
  };

  const username = store.user.username;
  const access_level = store.user.access_level
    ? parseAccessLevelStr(store.user.access_level)
    : "";

  const focusColor = "#FFFFFF";

  const ArrowContainer = styled.div`
    display: flex;
    align-items: center;
    margin-right: 2rem;
    svg {
      width: 50px;
      height: 50px;
    }
    &:hover {
      svg {
        animation: createBox 0.5s;
      }
    }

    @media (min-width: 1920px) {
      svg {
        width: 100px;
        height: 100px;
      }
    }

    @keyframes createBox {
      from {
        transform: scale(0.6);
      }
      to {
        transform: scale(1);
      }
    }
  `;
  const TaskBarContainer = styled.div`
    display: flex;
    flex-direction: row;
  `;
  const UserDetailsContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
  `;

  const UserDetailsSection = styled.div`
    display: flex;
    flex-direction: row;
  `;

  const TextContainer = styled.div`
    font-family: Montserrat;
    font-style: normal;
    font-size: 1rem;
    display: flex;
    align-items: center;

    color: #ffffff;

    @media (min-width: 1920px) {
      font-size: 2rem;
    }
  `;

  const navBarLabelStyle = {
    position: "absolute",
    top: "-50px",
    left: "-30%",
  };

  const Divider = styled.div`
    width: 0;
    height: 50%;
    margin-top: auto;
    margin-bottom: auto;
    color: #ffffff;
    border: 1px solid #ffffff;
    border-radius: 5px;
    margin-left: 1rem;
    margin-right: 1rem;
  `;

  var firstIconStyle = {
    marginLeft: "2rem",
    position: "relative",
    ...outerIconStyle,
  };

  var iconStyle = {
    position: "relative",
    ...outerIconStyle,
  };

  return (
    <div
      className="navigation-container"
      ref={navWidthRef}
      style={{
        transform: isCollapsed
          ? `translateX(calc(-${collapseOffset}px + 3rem ))` //TODO Media Query so small screen dont get collapsed menu invisible
          : "translateX(0)",
      }}
    >
      {/* ---------------------------------- */}
      <UserDetailsContainer>
        <UserDetailsSection>
          <NavBarUserIcon id="user-detail-user" />
          <TextContainer> : {username}</TextContainer>
        </UserDetailsSection>
        <UserDetailsSection>
          <NavBarAccessLevelIcon id="user-detail-level" />
          <TextContainer> : {access_level}</TextContainer>
        </UserDetailsSection>
      </UserDetailsContainer>
      {/* ---------------------------------- */}
      <TaskBarContainer>
        <div
          onMouseEnter={() => setImportFocused(true)}
          onMouseLeave={() => setIconsFocus(false)}
          style={firstIconStyle}
        >
          <NavBarLabelIcon
            style={navBarLabelStyle}
            id="icon-div"
            isFocused={importFocused}
            text="Import Data"
          />
          <ImportIcon
            style={svgContainerStyle}
            focused={importFocused}
            focusedColor={focusColor}
          />
        </div>
        <Divider />
        <div
          onMouseEnter={() => setEditCallersFocused(true)}
          onMouseLeave={() => setIconsFocus(false)}
          style={iconStyle}
        >
          <NavBarLabelIcon
            style={navBarLabelStyle}
            id="icon-div"
            isFocused={editCallersFocused}
            text="Edit Callers"
          />
          <EditCallersIcon
            style={svgContainerStyle}
            focused={editCallersFocused}
            focusedColor={focusColor}
          />
        </div>
        <Divider />
        <div
          onMouseEnter={() => setRequestsFocused(true)}
          onMouseLeave={() => setIconsFocus(false)}
          style={iconStyle}
        >
          <NavBarLabelIcon
            style={navBarLabelStyle}
            id="icon-div"
            isFocused={requestsFocused}
            text="Requests"
          />
          <RequestsIcon
            style={svgContainerStyle}
            focused={requestsFocused}
            focusedColor={focusColor}
          />
        </div>
        <Divider />
        <div
          onMouseEnter={() => setStudentsFocused(true)}
          onMouseLeave={() => setIconsFocus(false)}
          style={iconStyle}
        >
          <NavBarLabelIcon
            style={navBarLabelStyle}
            id="icon-div"
            isFocused={studentsFocused}
            text="Students"
          />
          <StudentsIcon
            style={svgContainerStyle}
            focused={studentsFocused}
            focusedColor={focusColor}
          />
        </div>
        <Divider />
        <div
          onMouseEnter={() => setAnalyticsFocused(true)}
          onMouseLeave={() => setIconsFocus(false)}
          style={iconStyle}
        >
          <NavBarLabelIcon
            style={navBarLabelStyle}
            id="icon-div"
            isFocused={analyticsFocused}
            text="Analytics"
          />
          <AnalyticsIcon
            style={svgContainerStyle}
            focused={analyticsFocused}
            focusedColor={focusColor}
          />
        </div>
        <Divider />
        <div
          onMouseEnter={() => setLogoutFocused(true)}
          onMouseLeave={() => setIconsFocus(false)}
          style={iconStyle}
        >
          <NavBarLabelIcon
            style={navBarLabelStyle}
            id="icon-div"
            isFocused={logoutFocused}
            text="Logout"
          />
          <LogoutIcon
            style={svgContainerStyle}
            focused={logoutFocused}
            focusedColor={focusColor}
          />
        </div>
        <Divider ref={dividerWidthRef} />
        <ArrowContainer ref={arrowWidthRef}>
          <ArrowIcon
            onClick={() => {
              setIsCollapsed(!isCollapsed);
              console.log(isCollapsed);
            }}
            style={{
              transform: isCollapsed
                ? `rotate(180deg)` //TODO: Create media queries so navbar doesn't go too far left on collapse
                : "rotate(0deg)",
            }}
          />
        </ArrowContainer>
      </TaskBarContainer>
      {/* ---------------------------------- */}
    </div>
  );
};

NavigationBar.propTypes = {
  editCallersFunc: PropTypes.func,
  requestsFunc: PropTypes.func,
  studentsFunc: PropTypes.func,
  analyticsFunc: PropTypes.func,
  logoutFunc: PropTypes.func,
};

export default NavigationBar;
