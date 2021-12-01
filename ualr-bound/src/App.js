import "./App.css";
import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useContext,
  useRef,
} from "react";
import LoginPage from "./pages/LoginPage/LoginPage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import injectContext, { Context } from "./store/appContext";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import RegisterRequestPage from "./pages/RegisterRequestPage/RegisterRequestPage";
import EditCallersPage from "./pages/EditCallersPage/EditCallersPage";
import StudentsPage from "./pages/StudentsPage/StudentsPage";
import AnalyticsPage from "./pages/AnalyticsPage/AnalyticsPage";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Route exact path="/" component={DashboardPage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
        <Route exact path="/requests" component={RegisterRequestPage} />
        <Route exact path="/callers" component={EditCallersPage} />
        <Route exact path="/students" component={StudentsPage} />
        <Route exact path="/analytics" component={AnalyticsPage}/>
      </div>
    </Router>
  );
};

export default injectContext(App);

export const FileUploader = forwardRef((props, ref) => {
  const { store, actions } = useContext(Context);

  const fileRef = useRef(null);

  const onChangeFile = (event) => {
    event.stopPropagation();
    event.preventDefault();
    var file = event.target.files[0];
    actions.setFile(file);
  };

  function handleClick() {
    document.body.onfocus = checkWindow;
  }

  function checkWindow() {
    actions.setImportIsVisible(false);
    document.body.onfocus = null;
  }

  const openUploader = async () => {
    fileRef.current.click();
  };

  useImperativeHandle(ref, () => ({
    openUploader,
  }));

  return (
    <input
      id="myInput"
      type="file"
      ref={fileRef}
      onClick={handleClick}
      style={{ display: "none" }}
      onChange={onChangeFile.bind(this)}
    />
  );
});
