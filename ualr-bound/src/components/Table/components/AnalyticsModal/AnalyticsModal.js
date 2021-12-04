import React, { useState, useContext, useEffect } from "react";
import { Context } from "../../../../store/appContext";
import Modal from "@material-ui/core/Modal";
import {
  makeStyles,
  createTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import PieChart from "../../../PieChart/PieChart";
import LineChart from "./LineChart/LineChart";

const AnalyticsModal = () => {
  const { store, actions } = useContext(Context);
  const [isVisible, setVisibility] = useState(false);
  const [pieChartInput, setPieChartInput] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);

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

  useEffect(() => {
    if (pieChartInput !== null) {
      // Call function immediately
      fetchData();
    }
    //pieChartInput ? setPieChartData(data) : setPieChartData(null);
  }, [pieChartInput]);

  useEffect(() => {
    console.log(pieChartData);
    //pieChartInput ? setPieChartData(data) : setPieChartData(null);
  }, [pieChartData]);

  const updatePieChartInput = (e) => {
    e.preventDefault();
    setPieChartInput(e.target.value);
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

  const classes = useStyles();

  let body = (
    <Paper elevation={3} className={classes.modal}>
      <div className={classes.form}>
        <div className={classes.pieChartContainer}>
          {pieChartData ? (
            <PieChart data={pieChartData} innerRadius={0} outerRadius={150} />
          ) : (
            "No data selected."
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
        <LineChart />
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
