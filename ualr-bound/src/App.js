import "./App.css";
import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage/LoginPage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import injectContext from "./store/appContext";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import RegisterRequestPage from "./pages/RegisterRequestPage/RegisterRequestPage";

const App = () => {
  const [state, setState] = useState({});

  // useEffect(() => {
  //   fetch("/api")
  //     .then((response) => {
  //       if (response.status === 200) {
  //         return response.json();
  //       }
  //     })
  //     .then((data) => setState(data))
  //     .then((error) => console.log(error));
  // }, []);

  return (
    <Router>
      <div className="app-container">
        <Route exact path="/" component={DashboardPage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
        <Route exact path="/requests" component={RegisterRequestPage} />
      </div>
    </Router>
  );
};

export default injectContext(App);
