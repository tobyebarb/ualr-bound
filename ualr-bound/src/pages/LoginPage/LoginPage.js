import React, { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import "./LoginPage.css";
import UserIcon from "../../icons/UserIcon";
import PassIcon from "../../icons/PassIcon";
import ualrLogo from "../../icons/UALR Logo.svg";
import { Link, BrowserRouter, useHistory, Redirect } from "react-router-dom";
import * as constants from "../../utils/Constants";
import { Context } from "../../store/appContext";

const LoginPage = () => {
  const { store, actions } = useContext(Context);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [userFocused, setUserFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);
  const history = useHistory();

  console.log("Token: ", store.token);

  const usernamePlaceholder = "Username";
  const passwordPlaceholder = "Password";

  const focusColor = "#4c212c";

  const loginBlockDuration = "1";
  const loginBlockImgDisplacement = "0.75rem";

  const svgContainerStyle = {
    margin: "0.3rem",
    marginRight: "1rem",
    display: "flex",
    float: "left",
  };
  const svgStyle = {
    height: "24px",
    width: "24px",
    color: "#ffffff",
  };

  const onKeyPressHandler = (e) => {
    e.preventDefault();
    if (e.key === "Enter") {
      // do something
    }
  };

  const handleLogout = () => {
    //TODO Logout - Remove store's token
  };

  const handleSubmit = () => {
    actions.login(usernameInput, passwordInput);
  };

  const updateUsername = (e) => {
    e.preventDefault();
    setUsernameInput(e.target.value);
  };

  const updatePassword = (e) => {
    e.preventDefault();
    setPasswordInput(e.target.value);
  };

  const onUserFocus = () => setUserFocused(true);
  const onUserBlur = () => setUserFocused(false);

  const onPassFocus = () => setPassFocused(true);
  const onPassBlur = () => setPassFocused(false);

  useEffect(() => {
    if (store.token && store.token !== "" && store.token !== null)
      history.push("/");
  }, []);

  if (!store.token || store.token === "" || store.token === null) {
    return (
      <div className="login-container">
        <motion.div
          className="hovering-image-container"
          initial={{
            y: loginBlockImgDisplacement,
          }}
          animate={{
            x: 0,
            y: 0,
          }}
          transition={{
            duration: loginBlockDuration,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <div className="login-form-container">
            <div
              style={{
                border: userFocused
                  ? `5px solid ${focusColor}`
                  : "5px solid #FFFFFF",
              }}
              className="login-input-row"
            >
              <UserIcon
                style={svgContainerStyle}
                svgStyle={svgStyle}
                focused={userFocused}
                focusedColor={focusColor}
              />
              <input
                required
                type="text"
                className="login-input"
                onFocus={onUserFocus}
                onBlur={onUserBlur}
                placeholder={usernamePlaceholder}
                name="username"
                id="user"
                value={usernameInput}
                onChange={updateUsername}
                content={focusColor}
              />
            </div>
            <div
              style={{
                border: passFocused
                  ? `5px solid ${focusColor}`
                  : "5px solid #FFFFFF",
              }}
              className="login-input-row"
            >
              <PassIcon
                style={svgContainerStyle}
                svgStyle={svgStyle}
                focused={passFocused}
                focusedColor={focusColor}
              />
              <input
                required
                type="password"
                className="login-input"
                onFocus={onPassFocus}
                onBlur={onPassBlur}
                placeholder={passwordPlaceholder}
                name="password"
                id="pass"
                value={passwordInput}
                onChange={updatePassword}
                content={focusColor}
              />
            </div>
            <div className="login-form-button-container">
              <button
                content={focusColor}
                onClick={handleSubmit}
                className="login-form-button"
              >
                Login
              </button>
              <BrowserRouter>
                <Link
                  to="/register"
                  onClick={() => {
                    window.location.href = "/register";
                  }}
                  content={focusColor}
                  className="login-form-button"
                >
                  Register
                </Link>
              </BrowserRouter>
            </div>
          </div>
        </motion.div>
        <div className="login-details">
          <h2 className="login-details-text">
            Welcome! Please sign in, or request approval for an account.
          </h2>
          <hr className="login-details-divider" />
          <img className="login-details-logo" src={ualrLogo} />
        </div>
      </div>
    );
  } else {
    //TODO: Already Logged In, redirect to dashboard/callers page
    console.log("Redirecting to dashboard.");
    return <Redirect to="/" />;
  }
};

export default LoginPage;
