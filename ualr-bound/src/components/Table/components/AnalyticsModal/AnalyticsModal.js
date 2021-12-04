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

  useEffect(() => {
    if (store.ui.analyticsModalIsVisible !== undefined) {
      setVisibility(store.ui.analyticsModalIsVisible);
    }
  }, [store.ui.analyticsModalIsVisible]);

  const handleClose = () => {
    setVisibility(false);
    actions.setAnalyticModalVisibility(false);
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

  const classes = useStyles();
  let data = [
    {
      value: 10,
    },
    {
      value: 20,
    },
    {
      value: 73,
    },
    {
      value: 30,
    },
  ];

  let body = (
    <Paper elevation={3} className={classes.modal}>
      <div className={classes.form}>
        <PieChart
          data={data}
          width={200}
          height={200}
          innerRadius={60}
          outerRadius={100}
        />
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
