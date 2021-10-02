import React, { useState } from "react";
import { motion } from "framer-motion";
import "./LoginPage.css";
import UserIcon from "../../icons/UserIcon";
import PassIcon from "../../icons/PassIcon";
import ualrLogo from "../../icons/UALR Logo.svg";
import { Link, BrowserRouter } from "react-router-dom";

const LoginPage = () => {
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [userFocused, setUserFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

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

  const handleSubmit = () => {};

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
        <form className="login-form-container" onSubmit={handleSubmit}>
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
              type="submit"
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
        </form>
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
};

export default LoginPage;
