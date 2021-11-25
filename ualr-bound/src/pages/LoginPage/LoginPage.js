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

  //TODO: On key press==="Enter", perform handleSubmit()
  const onKeyPressHandler = (e) => {
    if (e.key === "Enter") {
      // do something
      e.preventDefault();
      console.log("Enter key pressed!")
      handleSubmit();
    }
  };

  //needed for the invalid input stylization (shaking input field)
  var passElement = document.getElementById('pass');
  var addPassError = function() { passElement.classList.add('error'); };
  var removePassError = function() { passElement.classList.remove('error'); };

  var userElement = document.getElementById('user');
  var addUserError = function() { userElement.classList.add('error'); };
  var removeUserError = function() { userElement.classList.remove('error'); };

  //show error message
  const showErrorMessage = () =>{
   var element = document.getElementById('show-message').style.display = "block";
  }

  //hide error message
  const hideErrorMessage = () =>{
  var  element = document.getElementById('show-message').style.display = "none";
  }

  const handleSubmit = () => {
   let response = actions.login(usernameInput, passwordInput);
    response.then((value) =>{

      if(value !== 200){
        console.log(value);
        addPassError();
        addUserError();
        if(document.getElementById("show-message"))
          showErrorMessage();
      }
      else{
        actions.login(usernameInput, passwordInput);
      }
    });
    };

  const updateUsername = (e) => {
    e.preventDefault();
    setUsernameInput(e.target.value);
    removeUserError();
    removePassError();
    if(document.getElementById("show-message"))
      hideErrorMessage();
  };

  const updatePassword = (e) => {
    e.preventDefault();
    setPasswordInput(e.target.value);
    removePassError();
    removeUserError();
    if(document.getElementById("show-message"))
      hideErrorMessage();
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
          className="login-hovering-image-container"
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
                onKeyPress={onKeyPressHandler}
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
                onKeyPress={onKeyPressHandler}
              />
            </div>
            <span className = "error-message" id="show-message">
              Password or Username is incorrect!
            </span>
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
    console.log("Redirecting to dashboard.");
    return <Redirect to="/" />;
  }
};

export default LoginPage;
