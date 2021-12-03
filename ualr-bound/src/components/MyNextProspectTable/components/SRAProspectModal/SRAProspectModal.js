import React, {
  useState,
  useContext,
  useEffect,
  useImperativeHandle,
} from "react";
import PropTypes from "prop-types";
import { Context } from "../../../../store/appContext";
import Modal from "@material-ui/core/Modal";
import CallResponseIcon from "../../../../icons/CallResponseIcon";
import CallNotesIcon from "../../../../icons/CallNotesIcon";
import {
  makeStyles,
  createTheme,
  withStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";

const SRAProspectModal = (props) => {
  const { store, actions } = useContext(Context);
  const [isVisible, setVisibility] = useState(false);
  const [prospectSRAData, setProspectSRAData] = useState(null);
  const [callResponseInput, setCallResponseInput] = useState("");
  const [callNotesInput, setCallNotesInput] = useState("");

  const [callResponseFocused, setCallResponseFocused] = useState(false);
  const [callNotesFocused, setCallNotesFocused] = useState(false);

  const [isProspectUpdated, setIsProspectUpdated] = useState(false);

  const onCallResponseFocus = () => setCallResponseFocused(true);
  const onCallResponseBlur = () => setCallResponseFocused(false);
  const onCallNotesFocus = () => setCallNotesFocused(true);
  const onCallNotesBlur = () => setCallNotesFocused(false);

  const updateSRAData = async () => {
    const updateRes = await actions.updateProspectSRAData(
      callResponseInput,
      callNotesInput
    );

    if (updateRes.status === 400) {
      alert("Fill out call notes/response before getting next prospect.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    const res = await updateSRAData();

    if (res) {
      setIsProspectUpdated(true);
      handleClose();
    }
  };

  useEffect(() => {
    actions.setIsProspectUpdated(isProspectUpdated);
  }, [isProspectUpdated]);

  // Add inner async function
  const fetchData = async () => {
    try {
      const data = await actions.getStudentSRAInfo(props.selectedTNumber);
      setProspectSRAData(data);
    } catch (err) {
      console.log("Error", err);
      setProspectSRAData(null);
    }
  };

  var data = [];

  const focusColor = "#fff";

  const svgContainerStyle = {
    margin: "0.3rem",
    marginRight: "1rem",
    display: "flex",
    float: "left",
  };

  useEffect(() => {
    if (props.selectedTNumber !== null) {
      // Call function immediately
      fetchData();
    }
  }, [props.selectedTNumber]);

  useEffect(() => {
    if (store.ui.prospectModalIsVisible !== undefined) {
      setVisibility(store.ui.prospectModalIsVisible);
    }
  }, [store.ui.prospectModalIsVisible]);

  /**
   * handleClose - For when the user taps the Close X Icon or outside the modal window. Does not save settings.
   *
   * @param {None}
   * @returns {None}
   */
  const handleClose = () => {
    fetchData();
    setVisibility(false);
    actions.setProspectModalVisibility(false);
  };

  const updateCallNotes = (value) => {
    setCallNotesInput(value);
    //actions.updateCallNotes(value);
  };

  const updateCallResponse = (value) => {
    setCallResponseInput(value);
    //actions.updateCallResponse(value);
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
        borderRadius: 15,
      },
      form: {
        marginTop: "auto",
        marginBottom: "auto",
        width: "100%",
        background: "#4c212c",
        display: "flex",
        flexDirection: "column",
      },
      inputContainer: {
        display: "flex",
        flexDirection: "row",
      },
      inputTextContainer: {
        fontFamily: "Montserrat",
        fontSize: "1.5rem",
        display: "flex",
        flexDirection: "column",

        color: "#FFFFFF",
      },
      inputTextDesc: {
        border: "none",
        background: "transparent",
        boxsizing: "borderbox",
        width: "70%",

        marginRight: "3rem",

        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontSize: "1.25rem",

        color: "#ffffff",
        borderBottom: "solid 1px #fff",
        transition: "all 250ms ease-in-out",
      },
    };
  });

  const inputStyle = {
    background: "transparent",
    outline: "none",
    borderBottom: "solid 3px #fff",
  };

  const classes = useStyles();

  let body = (
    <Paper elevation={3} className={classes.modal}>
      <div className={classes.form}>
        <div className={classes.inputContainer}>
          <div className={classes.iconContainer}>
            <CallResponseIcon
              style={svgContainerStyle}
              focused={callResponseFocused}
              focusedColor={focusColor}
            />
          </div>
          <div className={classes.inputTextContainer}>
            <p className={classes.inputTextHeader}>Call Response:</p>
            <select
              required
              type="text"
              className={classes.inputTextDesc}
              name="call_response"
              id="call_response"
              onFocus={onCallResponseFocus}
              onBlur={onCallResponseBlur}
              placeholder={
                prospectSRAData !== null &&
                prospectSRAData.callResponse !== null
                  ? prospectSRAData.callResponse
                  : "N/A"
              }
              value={callResponseInput}
              onChange={(e) => updateCallResponse(e.target.value)}
              content={focusColor}
            >
              <option value="" selected disabled hidden>
                Choose one...
              </option>
              <option value="ANSWERED_BY_PROSPECTIVE_STUDENT">
                ANSWERED_BY_PROSPECTIVE_STUDENT
              </option>
              <option value="ANSWERED_BY_OTHER">ANSWERED_BY_OTHER</option>
              <option value="NO_ANSWER">NO_ANSWER</option>
              <option value="LEFT_VOICE_MESSAGE">LEFT_VOICE_MESSAGE</option>
              <option value="LEFT_MESSAGE_WITH_OTHER">
                LEFT_MESSAGE_WITH_OTHER
              </option>
            </select>
          </div>
        </div>
        <div className={classes.inputContainer}>
          <div className={classes.iconContainer}>
            <CallNotesIcon
              style={svgContainerStyle}
              focused={callNotesFocused}
              focusedColor={focusColor}
            />
          </div>
          <div className={classes.inputTextContainer}>
            <p className={classes.inputTextHeader}>Call Notes:</p>
            <input
              required
              type="text"
              className={classes.inputTextDesc}
              name="call_notes"
              id="call_notes"
              onFocus={onCallNotesFocus}
              onBlur={onCallNotesBlur}
              placeholder={
                prospectSRAData !== null && prospectSRAData.callNotes !== null
                  ? prospectSRAData.callNotes
                  : "N/A"
              }
              style={callNotesFocused ? inputStyle : {}}
              value={callNotesInput}
              onChange={(e) => updateCallNotes(e.target.value)}
              content={focusColor}
            />
          </div>
        </div>
        <div
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: "2rem",
          }}
          className="prospect-update-button-container"
        >
          <button onClick={handleSubmit} className="prospect-update-button">
            Submit Changes
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
        borderRadius: "15px",
      }}
      open={isVisible}
      onClose={() => handleClose()}
      aria-labelledby="sra-prospect-window"
      aria-describedby="modify sra data"
    >
      {body}
    </Modal>
  );
};

SRAProspectModal.propTypes = {
  title: PropTypes.string,
  connectToCommandServer: PropTypes.func,
};

export default SRAProspectModal;
