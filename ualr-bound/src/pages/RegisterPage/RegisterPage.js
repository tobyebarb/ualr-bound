import React, { useContext, useState } from "react";
/* TODO: Add first and last name as an entry to registration */
import validator from "validator";
import { motion } from "framer-motion";
import "./RegisterPage.css";
import NameIcon from "../../icons/NameIcon";
import UserIcon from "../../icons/UserIcon";
import PassIcon from "../../icons/PassIcon";
import EmailIcon from "../../icons/EmailIcon";
import AccessLevelIcon from "../../icons/AccessLevelIcon";
import ualrLogo from "../../icons/UALR Logo.svg";
import { Context } from "../../store/appContext";
import { Link, BrowserRouter } from "react-router-dom";
import * as constants from "../../utils/Constants";

const RegisterPage = () => {
  const { store, actions } = useContext(Context);
  const [nameInput, setNameInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [checkPasswordInput, setCheckPasswordInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [accessLevelInput, setAccessLevelInput] = useState("");

  const [nameFocused, setNameFocused] = useState(false);
  const [userFocused, setUserFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);
  const [checkPassFocused, setCheckPassFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [accessLevelFocused, setAccessLevelFocused] = useState(false);

  const namePlaceholder = "Name";
  const usernamePlaceholder = "Username";
  const passwordPlaceholder = "Password";
  const checkPasswordPlaceholder = "Re-Enter Password";
  const emailPlaceholder = "Email";
  const accessLevelPlaceholder = "Choose one...";

  const focusColor = "#4c212c";

  const RegisterBlockDuration = "1";
  const RegisterBlockImgDisplacement = "0.75rem";

  const svgContainerStyle = {
    margin: "0.3rem",
    marginRight: "1rem",
    display: "flex",
    float: "left",
  };

  const handleSubmit = () => {
    //TODO: Handle invalid emails
    
    if (validator.isEmail(emailInput)) {
      if (passwordInput === checkPasswordInput) {
        var data = {
          name: nameInput,
          username: usernameInput,
          email: emailInput,
          password: passwordInput,
          "access-level": accessLevelInput,
        };
        
        actions.register(
          nameInput,
          usernameInput,
          emailInput,
          passwordInput,
          accessLevelInput
        );

    window.location.href = "/login";
  };

  const updateName = (e) => {
    e.preventDefault();
    setNameInput(e.target.value);
  };

  const updateUsername = (e) => {
    e.preventDefault();
    setUsernameInput(e.target.value);
  };

  const updatePassword = (e) => {
    e.preventDefault();
    setPasswordInput(e.target.value);
  };

  const updataeValidatePassword = (e) => {
    e.preventDefault();
    setCheckPasswordInput(e.target.value);
  };

  const updateEmail = (e) => {
    e.preventDefault();
    setEmailInput(e.target.value);
  };

  const updateAccessLevel = (e) => {
    e.preventDefault();
    setAccessLevelInput(e.target.value);
  };

  const onNameFocus = () => setNameFocused(true);
  const onNameBlur = () => setNameFocused(false);
  const onUserFocus = () => setUserFocused(true);
  const onUserBlur = () => setUserFocused(false);
  const onPassFocus = () => setPassFocused(true);
  const onPassBlur = () => setPassFocused(false);
  const onCheckPassFocus = () => setCheckPassFocused(true);
  const onCheckPassBlur = () => setCheckPassFocused(false);
  const onEmailFocus = () => setEmailFocused(true);
  const onEmailBlur = () => setEmailFocused(false);
  const onAccessLevelFocus = () => setAccessLevelFocused(true);
  const onAccessLevelBlur = () => setAccessLevelFocused(false);

  return (
    <div className="register-container">
      <div className="register-middle">
        <div className="register-content">
          <motion.div
            className="register-hovering-image-container"
            initial={{
              y: RegisterBlockImgDisplacement,
            }}
            animate={{
              x: 0,
              y: 0,
            }}
            transition={{
              duration: RegisterBlockDuration,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <div className="register-form-container">
              <div
                style={{
                  border: nameFocused
                    ? `5px solid ${focusColor}`
                    : "5px solid #FFFFFF",
                }}
                className="register-input-row"
              >
                <NameIcon
                  style={svgContainerStyle}
                  focused={nameFocused}
                  focusedColor={focusColor}
                />
                <input
                  required
                  type="text"
                  className="register-input"
                  onFocus={onNameFocus}
                  onBlur={onNameBlur}
                  placeholder={namePlaceholder}
                  name="name"
                  id="name"
                  value={nameInput}
                  onChange={updateName}
                  content={focusColor}
                />
              </div>

              <div
                style={{
                  border: userFocused
                    ? `5px solid ${focusColor}`
                    : "5px solid #FFFFFF",
                }}
                className="register-input-row"
              >
                <UserIcon
                  style={svgContainerStyle}
                  focused={userFocused}
                  focusedColor={focusColor}
                />
                <input
                  required
                  type="text"
                  className="register-input"
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
                  border: emailFocused
                    ? `5px solid ${focusColor}`
                    : "5px solid #FFFFFF",
                }}
                className="register-input-row"
              >
                <EmailIcon
                  style={svgContainerStyle}
                  focused={emailFocused}
                  focusedColor={focusColor}
                />
                <input
                  required
                  type="email"
                  className="register-input"
                  onFocus={onEmailFocus}
                  onBlur={onEmailBlur}
                  placeholder={emailPlaceholder}
                  name="email"
                  id="email"
                  value={emailInput}
                  onChange={updateEmail}
                  content={focusColor}
                />
              </div>

              <div
                style={{
                  border: passFocused
                    ? `5px solid ${focusColor}`
                    : "5px solid #FFFFFF",
                }}
                className="register-input-row"
              >
                {/* 
          
          TODO: Add another password input to re-enter information, so user doesn't mess up password.
          TODO: Add "eyeball" visibility option to password input, so user doesn't mess up password.
          TODO: Add api response support to receive login fail cases ('user doesn't exist', 'invalid password', etc.)
            *TODO: Add dynamic password style, red for invalid pass/user
          
          */}
                <PassIcon
                  style={svgContainerStyle}
                  focused={passFocused}
                  focusedColor={focusColor}
                />
                <input
                  required
                  type="password"
                  className="register-input"
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

              <div
                style={{
                  border: passFocused
                    ? `5px solid ${focusColor}`
                    : "5px solid #FFFFFF",
                }}
                className="register-input-row"
              >
                <PassIcon
                  style={svgContainerStyle}
                  focused={checkPassFocused}
                  focusedColor={focusColor}
                />
                <input
                  required
                  type="password"
                  className="register-input"
                  onFocus={onCheckPassFocus}
                  onBlur={onCheckPassBlur}
                  placeholder={checkPasswordPlaceholder}
                  name="password"
                  id="pass"
                  value={checkPasswordInput}
                  onChange={updataeValidatePassword}
                  content={focusColor}
                />
              </div>

              <div
                style={{
                  border: accessLevelFocused
                    ? `5px solid ${focusColor}`
                    : "5px solid #FFFFFF",
                }}
                className="register-input-row"
              >
                <AccessLevelIcon
                  style={svgContainerStyle}
                  focused={accessLevelFocused}
                  focusedColor={focusColor}
                />
                <select
                  required
                  type="text"
                  className="register-input"
                  onFocus={onAccessLevelFocus}
                  onBlur={onAccessLevelBlur}
                  placeholder={accessLevelPlaceholder}
                  name="access-level"
                  id="access-level"
                  value={accessLevelInput}
                  onChange={updateAccessLevel}
                  content={focusColor}
                >
                  <option value="" selected disabled hidden>
                    Choose one...
                  </option>
                  <option value="caller">Caller</option>
                  <option value="admin">Admin</option>
                  <option value="root">Root</option>
                </select>
              </div>
            </div>
          </motion.div>
          <div className="register-details">
            <img className="register-details-logo" src={ualrLogo} />
            <hr className="register-details-divider" />
            <div className="register-form-button-container-col">
              <button
                content={focusColor}
                className="register-form-button"
                onClick={handleSubmit}
              >
                Send Request
              </button>
              <BrowserRouter>
                <Link
                  to="/login"
                  onClick={() => {
                    window.location.href = "/login";
                  }}
                  content={focusColor}
                  className="register-form-button"
                >
                  Go Back
                </Link>
              </BrowserRouter>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
