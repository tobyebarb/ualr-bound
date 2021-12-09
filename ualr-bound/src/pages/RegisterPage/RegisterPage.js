import React, { useContext, useEffect, useRef, useState } from "react";
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

  const [nameInvalid, setNameInvalid] = useState(false);
  const [userInvalid, setUserInvalid] = useState(false);
  const [passInvalid, setPassInvalid] = useState(false);
  const [checkPassInvalid, setCheckPassInvalid] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [accessLevelInvalid, setAccessLevelInvalid] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [errorMsgOffset, setErrorMsgOffset] = useState(null);

  /* var shake = keyframes`
    0% { transform: translateX(0); }
    25% { transform: translateX(-2rem); }
    50% { transform: translateX(2rem); }
    100% { transform: translateX(0); }
`;
*/

  const namePlaceholder = "Name";
  const usernamePlaceholder = "Username";
  const passwordPlaceholder = "Password";
  const checkPasswordPlaceholder = "Re-Enter Password";
  const emailPlaceholder = "Email";
  const accessLevelPlaceholder = "Choose one...";

  const focusColor = "#4c212c";
  const invalidFocusColor = "#ff0000";

  const RegisterBlockDuration = "1";
  const RegisterBlockImgDisplacement = "0.75rem";

  const svgContainerStyle = {
    margin: "0.3rem",
    marginRight: "1rem",
    display: "flex",
    float: "left",
  };

  const onKeyPressHandler = (e) => {
    if (e.key === "Enter") {
      // do something
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    //TODO: Handle invalid emails
    resetInvalidState();
    if (validator.isEmail(emailInput)) {
      if (passwordInput === checkPasswordInput) {
        let response = actions.register(
          nameInput,
          usernameInput,
          emailInput,
          passwordInput,
          accessLevelInput
        );
        response.then((value) => {
          setErrorMsg(value.msg);
          if (value && value.status !== 200) {
            value.msg === "Fill out name field."
              ? setNameInvalid(true)
              : setNameInvalid(false);
            value.msg === "Fill out username field." ||
            value.msg === "A user with that username already exists!"
              ? setUserInvalid(true)
              : setUserInvalid(false);
            value.msg === "Fill out password field."
              ? setPassInvalid(true)
              : setPassInvalid(false);
            value.msg === "Fill out email field." ||
            value.msg === "A user with that email already exists!"
              ? setEmailInvalid(true)
              : setEmailInvalid(false);
            value.msg === "Fill out access level field."
              ? setAccessLevelInvalid(true)
              : setAccessLevelInvalid(false);
          }
        });
      } else {
        setCheckPassInvalid(true);
        setErrorMsg("Passwords don't match!");
      }
    } else {
      setEmailInvalid(true);
      setErrorMsg("Email not in proper format.");
    }
  };

  const errorRef = useRef(null);

  useEffect(() => {
    if (errorRef.current !== null)
      setErrorMsgOffset(errorRef.current.offsetWidth / 2);
  }, [errorMsg]);

  const resetInvalidState = () => {
    setNameInvalid(false);
    setUserInvalid(false);
    setPassInvalid(false);
    setCheckPassInvalid(false);
    setEmailInvalid(false);
    setAccessLevelInvalid(false);
  };

  const updateName = (e) => {
    e.preventDefault();
    setNameInput(e.target.value);
    resetInvalidState();
  };

  const updateUsername = (e) => {
    e.preventDefault();
    setUsernameInput(e.target.value);
    resetInvalidState();
  };

  const updatePassword = (e) => {
    e.preventDefault();
    setPasswordInput(e.target.value);
    resetInvalidState();
  };

  const updateValidatePassword = (e) => {
    e.preventDefault();
    setCheckPasswordInput(e.target.value);
    resetInvalidState();
  };

  const updateEmail = (e) => {
    e.preventDefault();
    setEmailInput(e.target.value);
    resetInvalidState();
  };

  const updateAccessLevel = (e) => {
    e.preventDefault();
    setAccessLevelInput(e.target.value);
    resetInvalidState();
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
          {errorMsg ? (
            <div className="error-msg">
              <p
                style={{
                  position: "fixed",
                  bottom: "0",
                  left:
                    errorMsgOffset !== null
                      ? `calc(50% - ${errorMsgOffset}px)`
                      : "50%",
                }}
                ref={errorRef}
              >
                {errorMsg}
              </p>
            </div>
          ) : (
            <></>
          )}
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
            <div className="header"></div>
            <div className="form-container">
              <div className="register-form-container">
                <div
                  style={{
                    border: nameInvalid
                      ? `5px solid ${invalidFocusColor}`
                      : nameFocused
                      ? `5px solid ${focusColor}`
                      : "5px solid #FFFFFF",
                  }}
                  className={
                    nameInvalid
                      ? "register-input-row invalid"
                      : "register-input-row"
                  }
                >
                  <NameIcon
                    style={svgContainerStyle}
                    focused={nameFocused}
                    focusedColor={focusColor}
                    invalid={nameInvalid}
                    invalidFocusColor={invalidFocusColor}
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
                    onKeyPress={onKeyPressHandler}
                  />
                </div>

                <div
                  style={{
                    border: userInvalid
                      ? `5px solid ${invalidFocusColor}`
                      : userFocused
                      ? `5px solid ${focusColor}`
                      : "5px solid #FFFFFF",
                  }}
                  className={
                    userInvalid
                      ? "register-input-row invalid"
                      : "register-input-row"
                  }
                >
                  <UserIcon
                    style={svgContainerStyle}
                    focused={userFocused}
                    focusedColor={focusColor}
                    invalid={userInvalid}
                    invalidFocusColor={invalidFocusColor}
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
                    onKeyPress={onKeyPressHandler}
                  />
                </div>

                <div
                  style={{
                    border: emailInvalid
                      ? `5px solid ${invalidFocusColor}`
                      : emailFocused
                      ? `5px solid ${focusColor}`
                      : "5px solid #FFFFFF",
                  }}
                  className={
                    emailInvalid
                      ? "register-input-row invalid"
                      : "register-input-row"
                  }
                >
                  <EmailIcon
                    style={svgContainerStyle}
                    invalid={emailInvalid}
                    focused={emailFocused}
                    focusedColor={focusColor}
                    invalidFocusColor={invalidFocusColor}
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
                    onKeyPress={onKeyPressHandler}
                  />
                </div>

                <div
                  style={{
                    border: passInvalid
                      ? `5px solid ${invalidFocusColor}`
                      : passFocused
                      ? `5px solid ${focusColor}`
                      : "5px solid #FFFFFF",
                  }}
                  className={
                    passInvalid
                      ? "register-input-row invalid"
                      : "register-input-row"
                  }
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
                    invalid={passInvalid}
                    invalidFocusColor={invalidFocusColor}
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
                    onKeyPress={onKeyPressHandler}
                  />
                </div>

                <div
                  style={{
                    border: checkPassInvalid
                      ? `5px solid ${invalidFocusColor}`
                      : checkPassFocused
                      ? `5px solid ${focusColor}`
                      : "5px solid #FFFFFF",
                  }}
                  className={
                    checkPassInvalid
                      ? "register-input-row invalid"
                      : "register-input-row"
                  }
                >
                  <PassIcon
                    style={svgContainerStyle}
                    focused={checkPassFocused}
                    focusedColor={focusColor}
                    invalid={checkPassInvalid}
                    invalidFocusColor={invalidFocusColor}
                  />
                  <input
                    required
                    type="password"
                    className="register-input"
                    onFocus={onCheckPassFocus}
                    onBlur={onCheckPassBlur}
                    placeholder={checkPasswordPlaceholder}
                    name="password"
                    id="checkedPass"
                    value={checkPasswordInput}
                    onChange={updateValidatePassword}
                    content={focusColor}
                    onKeyPress={onKeyPressHandler}
                  />
                </div>

                <div
                  style={{
                    border: accessLevelInvalid
                      ? `5px solid ${invalidFocusColor}`
                      : accessLevelFocused
                      ? `5px solid ${focusColor}`
                      : "5px solid #FFFFFF",
                  }}
                  className={
                    accessLevelInvalid
                      ? "register-input-row invalid"
                      : "register-input-row"
                  }
                >
                  <AccessLevelIcon
                    style={svgContainerStyle}
                    focused={accessLevelFocused}
                    focusedColor={focusColor}
                    invalid={accessLevelInvalid}
                    invalidFocusColor={invalidFocusColor}
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
            </div>
          </motion.div>
          <div className="register-details">
            <img className="register-details-logo" src={ualrLogo} />
            <hr className="register-details-divider" />
            <div className="register-form-button-container-col">
              <button
                content={focusColor}
                className="register-form-button"
                onClick={() => handleSubmit()}
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
