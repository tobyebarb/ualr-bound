import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { Context } from "../../../../store/appContext";
import Modal from "@material-ui/core/Modal";
import {
  makeStyles,
  createTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import NameIcon from "../../../../icons/NameIcon";
import UserIcon from "../../../../icons/UserIcon";
import EmailIcon from "../../../../icons/EmailIcon";
import AccessLevelIcon from "../../../../icons/AccessLevelIcon";

const UserDetailsModal = (props) => {
  const { store, actions } = useContext(Context);
  const [isVisible, setVisibility] = useState(false);
  const [userData, setUserData] = useState(null);
  const [nameInput, setNameInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [accessLevelInput, setAccessLevelInput] = useState("");

  const [nameFocused, setNameFocused] = useState(false);
  const [userFocused, setUserFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [accessLevelFocused, setAccessLevelFocused] = useState(false);

  const updateName = (e) => {
    e.preventDefault();
    setNameInput(e.target.value);
  };

  const updateUsername = (e) => {
    e.preventDefault();
    setUsernameInput(e.target.value);
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
  const onEmailFocus = () => setEmailFocused(true);
  const onEmailBlur = () => setEmailFocused(false);
  const onAccessLevelFocus = () => setAccessLevelFocused(true);
  const onAccessLevelBlur = () => setAccessLevelFocused(false);

  const handleSubmit = async () => {
    var data = {
      name: nameInput !== "" && nameInput !== null ? nameInput : null,
      username:
        usernameInput !== "" && usernameInput !== null ? usernameInput : null,
      email: emailInput !== "" && emailInput !== null ? emailInput : null,
      accessLevel:
        accessLevelInput !== "" && accessLevelInput !== null
          ? accessLevelInput
          : null,
    };

    const res = await actions.modifyUser(parseInt(userData.id), data);
    handleClose();
  };

  const svgContainerStyle = {
    margin: "0.3rem",
    marginRight: "1rem",
    display: "flex",
    float: "left",
  };

  const focusColor = "#4c212c";

  useEffect(() => {
    if (props.selectedUID !== null) {
      // Add inner async function
      const fetchData = async () => {
        try {
          const data = await actions.getUserInfo(props.selectedUID);
          setUserData(data);
        } catch (err) {
          console.log("Error", err);
          setUserData(null);
        }
      };

      // Call function immediately
      fetchData();
    }
  }, [props.selectedUID]);

  useEffect(() => {
    if (store.ui.modalIsVisible !== undefined) {
      setVisibility(store.ui.modalIsVisible);
    }
  }, [store.ui.modalIsVisible]);

  /**
   * handleClose - For when the user taps the Close X Icon or outside the modal window. Does not save settings.
   *
   * @param {None}
   * @returns {None}
   */
  const handleClose = () => {
    props.updateData(); //update table with new modified info
    setVisibility(false);
    actions.setModalVisibility(false);
  };

  const theme = createTheme({
    palette: {
      primary: {
        light: "#5e97ff",
        main: "#367eff",
        dark: "#2558b2",
        contrastText: "#9d9d9d",
      },
    },
  });

  const useStyles = makeStyles((theme) => {
    return {
      modal: {
        boxShadow: theme.shadows[5],
        marginLeft: "auto",
        marginRight: "auto",
        display: "flex",
        justifyContent: "center",
        borderRadius: "15px",
      },
      form: {
        marginTop: "auto",
        marginBottom: "auto",
        width: "100%",
        background: focusColor,
      },
      buttonContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
      },
    };
  });

  const classes = useStyles();

  let body = (
    <Paper elevation={3} className={classes.modal}>
      <div className={classes.form}>
        <div className={classes.inputContainer}>
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
              placeholder={
                userData !== null && userData.name !== null
                  ? userData.name
                  : "N/A"
              }
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
              placeholder={
                userData !== null && userData.username !== null
                  ? userData.username
                  : "N/A"
              }
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
              placeholder={
                userData !== null && userData.email !== null
                  ? userData.email
                  : "N/A"
              }
              name="email"
              id="email"
              value={emailInput}
              onChange={updateEmail}
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
              placeholder={
                userData !== null && userData.accessLevel !== null
                  ? userData.accessLevel
                  : "N/A"
              }
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
        <div className={classes.buttonContainer}>
          <button
            content={focusColor}
            className="register-form-button"
            onClick={handleSubmit}
          >
            Send Request
          </button>
          <button
            content={focusColor}
            className="register-form-button"
            onClick={handleClose}
          >
            Go Back
          </button>
        </div>
      </div>
    </Paper>
  );

  return (
    <Modal
      style={{
        width: "60%",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "auto",
      }}
      open={isVisible}
      onClose={() => handleClose()}
      aria-labelledby="user-details-window"
      aria-describedby="modify user data"
    >
      {body}
    </Modal>
  );
};

UserDetailsModal.propTypes = {
  title: PropTypes.string,
  connectToCommandServer: PropTypes.func,
};

export default UserDetailsModal;
