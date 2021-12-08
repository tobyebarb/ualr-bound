import React, { useState, useContext, useEffect } from "react";
import { Context } from "../../../../store/appContext";
import Modal from "@material-ui/core/Modal";
import {
  makeStyles,
  createTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import { Divider, Paper } from "@material-ui/core";
import PieChart from "../../../PieChart/PieChart";
import LineChart from "./LineChart/LineChart";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { _ } from "ag-grid-community";

const AnalyticsModal = () => {
  const { store, actions } = useContext(Context);
  const [isVisible, setVisibility] = useState(false);
  const [pieChartInput, setPieChartInput] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [date0, setDate0] = useState(null);
  const [date1, setDate1] = useState(null);

  useEffect(() => {
    if (store.ui.analyticsModalIsVisible !== undefined) {
      setVisibility(store.ui.analyticsModalIsVisible);
    }
  }, [store.ui.analyticsModalIsVisible]);

  const handleClose = () => {
    setVisibility(false);
    actions.setAnalyticModalVisibility(false);
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
        background: "#4c212c",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      },
      buttonContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
      },
      dateContainer: {
        fontFamily: "Montserrat",
        fontSize: "1.5rem",

        color: "#FFFFFF",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: "3rem",
      },
      pieChartContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        marginRight: "auto",
        marginLeft: "auto",
      },
      lineChartContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        marginRight: "auto",
        marginLeft: "auto",
        width: "100%",
      },
      pieChartText: {
        fontFamily: "Montserrat",
        fontSize: "1.5rem",
        textAlign: "center",
        color: "#FFFFFF",
      },
      divider: {
        background: "#fff",
      },
    };
  });

  // Add inner async function
  const fetchData = async () => {
    try {
      const data = await actions.getPieChartData(pieChartInput);
      setPieChartData(data);
    } catch (err) {
      console.log("Error", err);
      setPieChartData(null);
    }
  };

  const parseDate = (date) => {
    if (date !== null) {
      var dateStr = date.toString().split(" ");
      var monthStr = dateStr[1];
      var dayStr = dateStr[2];
      var yearStr = dateStr[3];

      if (monthStr === "Jan") {
        monthStr = "01";
      } else if (monthStr === "Feb") {
        monthStr = "02";
      } else if (monthStr === "Mar") {
        monthStr = "03";
      } else if (monthStr === "Apr") {
        monthStr = "04";
      } else if (monthStr === "May") {
        monthStr = "05";
      } else if (monthStr === "Jun") {
        monthStr = "06";
      } else if (monthStr === "Jul") {
        monthStr = "07";
      } else if (monthStr === "Aug") {
        monthStr = "08";
      } else if (monthStr === "Sep") {
        monthStr = "09";
      } else if (monthStr === "Oct") {
        monthStr = "10";
      } else if (monthStr === "Nov") {
        monthStr = "11";
      } else if (monthStr === "Dec") {
        monthStr = "12";
      } else {
        return "Invalid month chosen.";
      }

      var formattedStr = yearStr + monthStr + dayStr;
      return formattedStr;
    } else {
      return null;
    }
  }; // Tue Dec 07 2021 00:00:00 GMT-0600 (Central Standard Time)

  useEffect(() => {
    let formattedDate = parseDate(date0);
    actions.setStoreDate0(formattedDate);
  }, [date0]);

  useEffect(() => {
    let formattedDate = parseDate(date1);
    actions.setStoreDate1(formattedDate);
  }, [date1]);

  useEffect(() => {
    if (pieChartInput !== null) {
      // Call function immediately
      fetchData();
    }
    //pieChartInput ? setPieChartData(data) : setPieChartData(null);
  }, [pieChartInput]);

  const updatePieChartInput = (e) => {
    e.preventDefault();
    setPieChartInput(e.target.value);
  };

  const classes = useStyles();

  let body = (
    <Paper elevation={3} className={classes.modal}>
      <div className={classes.form}>
        <div className={classes.pieChartContainer}>
          {pieChartData ? (
            <PieChart data={pieChartData} innerRadius={0} outerRadius={100} />
          ) : (
            <p className={classes.pieChartText}>"No data selected."</p>
          )}
          <select
            required
            type="text"
            //className="register-input"
            name="pie-chart-input"
            id="pie-chart-input"
            value={pieChartInput}
            onChange={updatePieChartInput}
          >
            <option value="" selected disabled hidden>
              Choose one...
            </option>
            <option value="sex">Sex</option>
            <option value="ethnicity">Ethnicity</option>
            <option value="admissionType">Admission Type</option>
            <option value="program">Program</option>
            <option value="college">College</option>
            <option value="department">Department</option>
            <option value="decision">Decision</option>
          </select>
        </div>
        <Divider
          style={{ marginTop: "4rem" }}
          classes={{ root: classes.divider }}
          variant="middle"
        />
        <div className={classes.lineChartContainer}>
          <LineChart />
          <div className={classes.dateContainer}>
            <div>
              <p>Start Date:</p>
              <DatePicker
                selected={date0}
                onChange={(date) => setDate0(date)}
              />
            </div>
            <div>
              <p>End Date:</p>
              <DatePicker
                selected={date1}
                onChange={(date) => setDate1(date)}
              />
            </div>
          </div>
        </div>
        <button onClick={handleClose}>Close Modal</button>
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
    >
      {body}
    </Modal>
  );
};

export default AnalyticsModal;
