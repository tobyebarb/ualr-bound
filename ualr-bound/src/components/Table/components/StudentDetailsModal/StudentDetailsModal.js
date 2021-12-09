import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { Context } from "../../../../store/appContext";
import Modal from "@material-ui/core/Modal";
import "./StudentDetailsModal.css";
import { makeStyles, createTheme } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";

const StudentDetailsModal = (props) => {
  const { store, actions } = useContext(Context);
  const [buttonFocus, setButtonFocus] = useState(false);
  const [isVisible, setVisibility] = useState(false);
  const [studentData, setStudentData] = useState(null);
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

  const handleSubmit = async () => {
    var data = {
      name1:
        firstNameInput !== "" && firstNameInput !== null
          ? firstNameInput
          : null,
      name2:
        middleNameInput !== "" && middleNameInput !== null
          ? middleNameInput
          : null,
      name3:
        lastNameInput !== "" && lastNameInput !== null ? lastNameInput : null,
      level: levelInput !== "" && levelInput !== null ? levelInput : null,
      program:
        programInput !== "" && programInput !== null ? programInput : null,
      college:
        collegeInput !== "" && collegeInput !== null ? collegeInput : null,
      department:
        departmentInput !== "" && departmentInput !== null
          ? departmentInput
          : null,
      decision:
        decisionInput !== "" && decisionInput !== null ? decisionInput : null,
      admitDate:
        admitDateInput !== "" && admitDateInput !== null
          ? admitDateInput
          : null,
      address1:
        address1Input !== "" && address1Input !== null ? address1Input : null,
      address2:
        address2Input !== "" && address2Input !== null ? address2Input : null,
      address3:
        address3Input !== "" && address3Input !== null ? address3Input : null,
      city: cityInput !== "" && cityInput !== null ? cityInput : null,
      state: stateInput !== "" && stateInput !== null ? stateInput : null,
      zip: zipInput !== "" && zipInput !== null ? zipInput : null,
      areaCode:
        areaCodeInput !== "" && areaCodeInput !== null ? areaCodeInput : null,
      phone: phoneInput !== "" && phoneInput !== null ? phoneInput : null,
      phoneExt:
        phoneExtInput !== "" && phoneExtInput !== null ? phoneExtInput : null,
      email: emailInput !== "" && emailInput !== null ? emailInput : null,
      emailSchool:
        emailSchoolInput !== "" && emailSchoolInput !== null
          ? emailSchoolInput
          : null,
      ethnicity:
        ethnicityInput !== "" && ethnicityInput !== null
          ? ethnicityInput
          : null,
      sex: sexInput !== "" && sexInput !== null ? sexInput : null,
      admissionType:
        admissionTypeInput !== "" && admissionTypeInput !== null
          ? admissionTypeInput
          : null,
      studentType:
        studentTypeInput !== "" && studentTypeInput !== null
          ? studentTypeInput
          : null,
    };

    const res = await actions.modifyStudent(
      studentData.tNumber,
      data,
      props.updateFunc
    );
    handleClose();
  };

  // Add inner async function
  const fetchData = async () => {
    try {
      const data = await actions.getFullStudentInfo(props.selectedTNumber);
      setStudentData(data);
    } catch (err) {
      console.log("Error", err);
      setStudentData(null);
    }
  };

  const focusColor = "#4c212c";

  useEffect(() => {
    if (props.selectedTNumber !== null) {
      // Call function immediately
      fetchData();
    }
  }, [props.selectedTNumber]);

  useEffect(() => {
    if (store.ui.studentModalIsVisible !== undefined) {
      setVisibility(store.ui.studentModalIsVisible);
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
        overflowY: "scroll",
        height: "80vh",
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
        <button onClick={handleSubmit} className="submit-button">
          Confirm Changes
        </button>
        <div className="input-container">
          <p className="student-input-header">First Name:</p>
          <input
            required
            type="text"
            className="student-input"
            name="name"
            id="name"
            placeholder={
              studentData !== null && studentData.name1 !== null
                ? studentData.name1
                : "N/A"
            }
            value={firstNameInput}
            onChange={(e) => setFirstNameInput(e.target.value)}
            content={focusColor}
          />
        </div>
        <div className="input-container">
          <p className="student-input-header">Middle Name:</p>
          <input
            required
            type="text"
            className="student-input"
            name="name"
            id="name"
            placeholder={
              studentData !== null && studentData.name2 !== null
                ? studentData.name2
                : "N/A"
            }
            value={middleNameInput}
            onChange={(e) => setMiddleNameInput(e.target.value)}
            content={focusColor}
          />
        </div>
        <div className="input-container">
          <p className="student-input-header">Last Name:</p>
          <input
            required
            type="text"
            className="student-input"
            name="name"
            id="name"
            placeholder={
              studentData !== null && studentData.name3 !== null
                ? studentData.name3
                : "N/A"
            }
            value={lastNameInput}
            onChange={(e) => setLastNameInput(e.target.value)}
            content={focusColor}
          />
        </div>
        <div className="input-container">
          <p className="student-input-header">Level:</p>
          <input
            required
            type="text"
            className="student-input"
            name="name"
            id="name"
            placeholder={
              studentData !== null && studentData.level !== null
                ? studentData.level
                : "N/A"
            }
            value={levelInput}
            onChange={(e) => setLevelInput(e.target.value)}
            content={focusColor}
          />
        </div>
        <div className="input-container">
          <p className="student-input-header">Program:</p>
          <select
            required
            type="text"
            className="student-input"
            name="name"
            id="name"
            placeholder={
              studentData !== null && studentData.program !== null
                ? studentData.program
                : "N/A"
            }
            value={programInput}
            onChange={(e) => setProgramInput(e.target.value)}
            content={focusColor}
          >
            <option value="" selected disabled hidden>
              Choose one...
            </option>
            <option value="ACCT-BBA">ACCT-BBA / Accounting</option>
            <option value="ANTH-BA">ANTH-BA / Anthropology</option>
            <option value="BIOL-BS-1">
              BIOL-BS / Biology, Ecology & Organismal Concentration
            </option>
            <option value="BIOL-BS-2">
              BIOL-BS / Biology, Education Track
            </option>
            <option value="BIOL-BS-3">
              BIOL-BS / Biology, General Biology Concentration
            </option>
            <option value="BIOL-BS-4">
              BIOL-BS / Biology, Molecular Biotechnology Concentration
            </option>
            <option value="CHEM-BS">CHEM-BS / Chemistry</option>
            <option value="CPSC-BS">CPSC-BS / Computer Science</option>
            <option value="CPSCG-BS ">
              CPSCG-BS / Computer Science, Game-BS
            </option>
            <option value="CPSC-BA">CPSC-BA / Computer Science</option>
            <option value="CPSCG-BA">
              CPSCG-BA / Computer Science, Game-BA
            </option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div className="input-container">
          <p className="student-input-header">College:</p>
          <select
            required
            type="text"
            className="student-input"
            name="name"
            id="name"
            placeholder={
              studentData !== null && studentData.college !== null
                ? studentData.college
                : "N/A"
            }
            value={collegeInput}
            onChange={(e) => setCollegeInput(e.target.value)}
            content={focusColor}
          >
            <option value="" selected disabled hidden>
              Choose one...
            </option>
            <option value="Donaghey Col Sci Tech Eng Math">
              Donaghey Col Sci Tech Eng Math
            </option>
            <option value="College of Business, Health, and Human Services">
              College of Business, Health, and Human Services
            </option>
            <option value="School of Business">School of Business</option>
            <option value="College of Humanities, Arts, Social Sciences, and Education">
              College of Humanities, Arts, Social Sciences, and Education
            </option>
          </select>
        </div>
        <div className="input-container">
          <p className="student-input-header">Department:</p>
          <select
            required
            type="text"
            className="student-input"
            name="name"
            id="name"
            placeholder={
              studentData !== null && studentData.department !== null
                ? studentData.department
                : "N/A"
            }
            value={departmentInput}
            onChange={(e) => setDepartmentInput(e.target.value)}
            content={focusColor}
          >
            <option value="" selected disabled hidden>
              Choose one...
            </option>
            <option value="ACCT">ACCT</option>
            <option value="ANTH">ANTH</option>
            <option value="BIOL">BIOL</option>
            <option value="CHEM">CHEM</option>
            <option value="CPSC">CPSC</option>
            <option value="ENGL">ENGL</option>
            <option value="MATH">MATH</option>
            <option value="MSCI">MSCI</option>
            <option value="MUED">MUED</option>
            <option value="MUTH">MUTH</option>
            <option value="NURS">NURS</option>
            <option value="PHYS">PHYS</option>
            <option value="SOCI">SOCI</option>
            <option value="THEA">THEA</option>
            <option value="OTHER">OTHER</option>
          </select>
        </div>
        <div className="input-container">
          <p className="student-input-header">Decision:</p>
          <input
            required
            type="text"
            className="student-input"
            name="name"
            id="name"
            placeholder={
              studentData !== null && studentData.decision !== null
                ? studentData.decision
                : "N/A"
            }
            value={decisionInput}
            onChange={(e) => setDecisionInput(e.target.value)}
            content={focusColor}
          />
        </div>
        <div className="input-container">
          <p className="student-input-header">Admit Date:</p>
          <input
            required
            type="text"
            className="student-input"
            name="name"
            id="name"
            placeholder={
              studentData !== null && studentData.admitDate !== null
                ? studentData.admitDate
                : "N/A"
            }
            value={admitDateInput}
            onChange={(e) => setAdmitDateInput(e.target.value)}
            content={focusColor}
          />
        </div>
        <div className="input-container">
          <p className="student-input-header">Address 1:</p>
          <input
            required
            type="text"
            className="student-input"
            name="address1"
            id="address1"
            placeholder={
              studentData !== null && studentData.address1 !== null
                ? studentData.address1
                : "N/A"
            }
            value={address1Input}
            onChange={(e) => setAddress1Input(e.target.value)}
            content={focusColor}
          />
        </div>
        <div className="input-container">
          <p className="student-input-header">Address 2:</p>
          <input
            required
            type="text"
            className="student-input"
            name="name"
            id="name"
            placeholder={
              studentData !== null && studentData.address2 !== null
                ? studentData.address2
                : "N/A"
            }
            value={address2Input}
            onChange={(e) => setAddress2Input(e.target.value)}
            content={focusColor}
          />
        </div>
        <div className="input-container">
          <p className="student-input-header">Address 3:</p>
          <input
            required
            type="text"
            className="student-input"
            name="name"
            id="name"
            placeholder={
              studentData !== null && studentData.address3 !== null
                ? studentData.address3
                : "N/A"
            }
            value={address3Input}
            onChange={(e) => setAddress3Input(e.target.value)}
            content={focusColor}
          />
        </div>
        <div className="input-container">
          <p className="student-input-header">City:</p>
          <input
            required
            type="text"
            className="student-input"
            name="name"
            id="name"
            placeholder={
              studentData !== null && studentData.city !== null
                ? studentData.city
                : "N/A"
            }
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            content={focusColor}
          />
        </div>
        <div className="input-container">
          <p className="student-input-header">State:</p>
          <input
            required
            type="text"
            className="student-input"
            name="name"
            id="name"
            placeholder={
              studentData !== null && studentData.state !== null
                ? studentData.state
                : "N/A"
            }
            value={stateInput}
            onChange={(e) => setStateInput(e.target.value)}
            content={focusColor}
          />
        </div>
        <div className="input-container">
          <p className="student-input-header">Zip Code:</p>
          <input
            required
            type="text"
            className="student-input"
            name="name"
            id="name"
            placeholder={
              studentData !== null && studentData.zip !== null
                ? studentData.zip
                : "N/A"
            }
            value={zipInput}
            onChange={(e) => setZipInput(e.target.value)}
            content={focusColor}
          />
        </div>
        <div className="input-container">
          <p className="student-input-header">Area Code:</p>
          <input
            required
            type="text"
            className="student-input"
            name="name"
            id="name"
            placeholder={
              studentData !== null && studentData.areaCode !== null
                ? studentData.areaCode
                : "N/A"
            }
            value={areaCodeInput}
            onChange={(e) => setAreaCodeInput(e.target.value)}
            content={focusColor}
          />
        </div>
        <div className="input-container">
          <p className="student-input-header">Phone:</p>
          <input
            required
            type="text"
            className="student-input"
            name="name"
            id="name"
            placeholder={
              studentData !== null &&
              studentData.phone !== null &&
              studentData.phone !== "0"
                ? studentData.phone
                : "N/A"
            }
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            content={focusColor}
          />
        </div>
        <div className="input-container">
          <p className="student-input-header">Phone Ext:</p>
          <input
            required
            type="text"
            className="student-input"
            name="name"
            id="name"
            placeholder={
              studentData !== null && studentData.phoneExt !== null
                ? studentData.phoneExt
                : "N/A"
            }
            value={phoneExtInput}
            onChange={(e) => setPhoneExtInput(e.target.value)}
            content={focusColor}
          />
        </div>
        <div className="input-container">
          <p className="student-input-header">Email:</p>
          <input
            required
            type="text"
            className="student-input"
            name="name"
            id="name"
            placeholder={
              studentData !== null && studentData.email !== null
                ? studentData.email
                : "N/A"
            }
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            content={focusColor}
          />
        </div>
        <div className="input-container">
          <p className="student-input-header">UALR Email:</p>
          <input
            required
            type="text"
            className="student-input"
            name="name"
            id="name"
            placeholder={
              studentData !== null && studentData.emailSchool !== null
                ? studentData.emailSchool
                : "N/A"
            }
            value={emailSchoolInput}
            onChange={(e) => setEmailSchoolInput(e.target.value)}
            content={focusColor}
          />
        </div>
        <div className="input-container">
          <p className="student-input-header">Ethnicity:</p>
          <input
            required
            type="text"
            className="student-input"
            name="name"
            id="name"
            placeholder={
              studentData !== null && studentData.ethnicity !== null
                ? studentData.ethnicity
                : "N/A"
            }
            value={ethnicityInput}
            onChange={(e) => setEthnicityInput(e.target.value)}
            content={focusColor}
          />
        </div>
        <div className="input-container">
          <p className="student-input-header">Sex:</p>
          <input
            required
            type="text"
            className="student-input"
            name="name"
            id="name"
            placeholder={
              studentData !== null && studentData.sex !== null
                ? studentData.sex
                : "N/A"
            }
            value={sexInput}
            onChange={(e) => setSexInput(e.target.value)}
            content={focusColor}
          />
        </div>
        <div className="input-container">
          <p className="student-input-header">Admission Type:</p>
          <input
            required
            type="text"
            className="student-input"
            name="name"
            id="name"
            placeholder={
              studentData !== null && studentData.admissionType !== null
                ? studentData.admissionType
                : "N/A"
            }
            value={admissionTypeInput}
            onChange={(e) => setAdmissionTypeInput(e.target.value)}
            content={focusColor}
          />
        </div>
        <div className="input-container" id="last-input-container">
          <p className="student-input-header">Student Type:</p>
          <input
            required
            type="text"
            className="student-input"
            name="name"
            id="name"
            placeholder={
              studentData !== null && studentData.studentType !== null
                ? studentData.studentType
                : "N/A"
            }
            value={studentTypeInput}
            onChange={(e) => setStudentTypeInput(e.target.value)}
            content={focusColor}
          />
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
