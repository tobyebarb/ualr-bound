import React, { useState } from "react";
import { motion } from "framer-motion";
import "./LoginPage.css";
import UserIcon from "../../icons/UserIcon";
import PassIcon from "../../icons/PassIcon";
import ualrLogo from "../../icons/UALR Logo.svg";
import { Link, BrowserRouter } from "react-router-dom";
import * as constants from "../../utils/Constants";

const LoginPage = () => {
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [userFocused, setUserFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);
  const token = sessionStorage.getItem("token");
  console.log("This is your token", token);

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

  const endpoint = `${constants.ENDPOINT_URL.LOCAL}/token`;

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const onKeyPressHandler = (e) => {
    e.preventDefault();
    if (e.key === "Enter") {
      // do something
    }
  };

  const handleLogout = () => {
    sessionStorage.setItem("token", "");
    window.location.href = "/";
  };

  const handleSubmit = () => {
    if (!usernameInput || !passwordInput) {
      alert("Please fill out required fields.");
      return 0;
    }

    var data = {
      username: usernameInput,
      password: passwordInput,
    };

    fetch(endpoint, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        else console.error("There was an error code: " + response.status);
      })
      .then((data) => {
        console.log("this came from backend", data);
        sessionStorage.setItem("token", data.access_token);
        window.location.href = "/";
      })
      .catch((error) => {
        console.error(
          "There was an error with your request. Try again.\nError: " + error
        );
      });
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

  if (!token || token === "" || token === null) {
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
    return (
      <div className="login-container">
        <h1>Logged In.</h1>
        <button
          content={focusColor}
          onClick={handleLogout}
          className="login-form-button"
        >
          Log Out
        </button>
      </div>
    );
  }
};

export default LoginPage;
