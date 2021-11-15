import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { Context } from "../../../../store/appContext";
import Modal from "@material-ui/core/Modal";
import { makeStyles, createTheme } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";

const StudentDetailsModal = (props) => {
  const { store, actions } = useContext(Context);
  const [isVisible, setVisibility] = useState(false);
  const [userData, setUserData] = useState(null);
  const [tNumberInput, setTNumberInput] = useState("");
  const [firstNameInput, setFirstNameInput] = useState("");
  const [middleNameInput, setMiddleNameInput] = useState("");
  const [lastNameInput, setLastNameInput] = useState("");
  const [levelInput, setLevelInput] = useState("");
  const [programInput, setProgramInput] = useState("");
  const [collegeInput, setCollegeInput] = useState("");
  const [departmentInput, setDepartmentInput] = useState("");
  const [decisionInput, setDecisionInput] = useState("");
  const [admitDateInput, setAdmitDateInput] = useState("");
  const [address1Input, setAddress1Input] = useState("");
  const [address2Input, setAddress2Input] = useState("");
  const [address3Input, setAddress3Input] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [stateInput, setStateInput] = useState("");
  const [zipInput, setZipInput] = useState("");
  const [areaCodeInput, setAreaCodeInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [phoneExtInput, setPhoneExtInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [emailSchoolInput, setEmailSchoolInput] = useState("");
  const [ethnicityInput, setEthnicityInput] = useState("");
  const [sexInput, setSexInput] = useState("");
  const [admissionTypeInput, setAdmissionTypeInput] = useState("");
  const [studentTypeInput, setStudentTypeInput] = useState("");

  // const handleSubmit = async () => {
  //   var data = {
  //     name: nameInput !== "" && nameInput !== null ? nameInput : null,
  //     username:
  //       usernameInput !== "" && usernameInput !== null ? usernameInput : null,
  //     email: emailInput !== "" && emailInput !== null ? emailInput : null,
  //     accessLevel:
  //       accessLevelInput !== "" && accessLevelInput !== null
  //         ? accessLevelInput
  //         : null,
  //   };

  //   const res = await actions.modifyUser(parseInt(userData.id), data);
  //   handleClose();
  // };

  const svgContainerStyle = {
    margin: "0.3rem",
    marginRight: "1rem",
    display: "flex",
    float: "left",
  };

  const focusColor = "#4c212c";

  // useEffect(() => {
  //   if (props.selectedUID !== null) {
  //     // Add inner async function
  //     const fetchData = async () => {
  //       try {
  //         const data = await actions.getUserInfo(props.selectedUID);
  //         setUserData(data);
  //       } catch (err) {
  //         console.log("Error", err);
  //         setUserData(null);
  //       }
  //     };

  //     // Call function immediately
  //     fetchData();
  //   }
  // }, [props.selectedUID]);

  useEffect(() => {
    if (store.ui.studentModalIsVisible !== undefined) {
      setVisibility(store.ui.studentModalIsVisible);
      console.log("VISIBILITY: ", isVisible);
      if (store.ui.studentModalIsVisible) {
        console.log("WE VISIBLE");
      }
    }
  }, [store.ui.studentModalIsVisible]);

  /**
   * handleClose - For when the user taps the Close X Icon or outside the modal window. Does not save settings.
   *
   * @param {None}
   * @returns {None}
   */
  const handleClose = () => {
    props.updateData(); //update table with new modified info
    setVisibility(false);
    actions.setStudentModalVisibility(false);
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
        <input
          required
          type="text"
          className="register-input"
          name="name"
          id="name"
          value={firstNameInput}
          onChange={(e) => setFirstNameInput(e.target.value)}
          content={focusColor}
        />
        <input
          required
          type="text"
          className="register-input"
          name="name"
          id="name"
          value={middleNameInput}
          onChange={(e) => setMiddleNameInput(e.target.value)}
          content={focusColor}
        />
        <input
          required
          type="text"
          className="register-input"
          name="name"
          id="name"
          value={lastNameInput}
          onChange={(e) => setLastNameInput(e.target.value)}
          content={focusColor}
        />
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
      aria-labelledby="student-details-window"
      aria-describedby="modify student data"
    >
      {body}
    </Modal>
  );
};

StudentDetailsModal.propTypes = {
  title: PropTypes.string,
  connectToCommandServer: PropTypes.func,
};

export default StudentDetailsModal;
