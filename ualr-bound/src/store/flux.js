import { useRef } from "react";
import PhoneIcon from "../icons/PhoneIcon";
import * as constants from "../utils/Constants";

const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      lineChart: {
        date0: null,
        date1: null,
      },
      isProspectUpdated: false,
      selectedProspectSRAData: null,
      callResponse: null,
      callNotes: null,
      prospect: null,
      file: null,
      window: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      modalIsVisible: false,
      ui: {
        modalIsVisible: false,
        studentModalIsVisible: false,
        prospectModalIsVisible: false,
        analyticsModalIsVisible: false,
        importIsVisible: false,
        selectedUserID: null,
        selectedUserData: null,
        selectedStudent: null,
        selectedStudentData: null,
      },
      decisionBtnHeight: null,
      token: null,
      message: null,
      user: {
        username: null,
        email: null,
        access_level: null,
      },
      requests: null,
    },
    actions: {
      getStoreDate0: () => {
        const store = getStore();
        return store.lineChart.date0;
      },
      getStoreDate1: () => {
        const store = getStore();
        return store.lineChart.date1;
      },
      setStoreDate0: (date) => {
        const store = getStore();
        setStore({
          lineChart: { date0: date },
        });
        return store.lineChart.date0;
      },
      setStoreDate1: (date) => {
        const store = getStore();
        setStore({
          lineChart: { date1: date },
        });
        return store.lineChart.date1;
      },
      setIsProspectUpdated: (bool) => {
        setStore({
          isProspectUpdated: bool,
        });
        return 1;
      },
      updateCallResponse: (callResponse) => {
        setStore({
          callResponse: callResponse,
        });
        return 1;
      },
      updateCallNotes: (callNotes) => {
        setStore({
          callNotes: callNotes,
        });
        return 1;
      },
      getPieChartData: async (pieChartInput) => {
        const store = getStore();

        const newData = {
          column_name: pieChartInput,
        };

        const opts = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + store.token,
          },
          body: JSON.stringify(newData),
        };
        const endpoint = `${constants.ENDPOINT_URL.PRODUCTION}/api/getFullStudentsRatio/`;

        try {
          const response = await fetch(endpoint, opts);

          if (response.status !== 200) {
            alert("There has been some error");
            return false;
          }

          const data = await response.json();

          var row_data = [Object.keys(data).length];

          for (let i = 0; i < Object.keys(data).length; i++) {
            var new_data = {
              label: Object.keys(data)[i],
              value: data[Object.keys(data)[i]],
            };
            row_data[i] = new_data;
          }

          return row_data;
        } catch (error) {
          console.error("Error", error);
          console.log("Error", error);
        }
      },
      updateProspectSRAData: async (callResponse, callNotes) => {
        const store = getStore();

        var newData = {
          callResponse: callResponse,
          callNotes: callNotes,
        };

        if (
          callResponse === "" ||
          callResponse === undefined ||
          callResponse === null ||
          callNotes === "" ||
          callNotes === undefined ||
          callNotes === null
        ) {
          console.log("Error");
          return { msg: "Please fill out response and notes.", status: 400 };
        }
        const headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + store.token,
        };

        const endpoint = `${constants.ENDPOINT_URL.PRODUCTION}/api/updateProspectData`;

        fetch(endpoint, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(newData),
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            console.log(data);
          })
          .catch((error) => {
            console.error(
              "There was an error with your request. Try again.\nError: " +
                error
            );
          });

        return true;
      },
      getStudentSRAInfo: async (tNumber) => {
        const store = getStore();
        const opts = {
          headers: {
            Authorization: "Bearer " + store.token,
          },
          method: "GET",
        };
        const endpoint = `${constants.ENDPOINT_URL.PRODUCTION}/api/getStudentSRAInfo/${tNumber}`;
        // fetching data from the backend
        const response = await fetch(endpoint, opts);

        if (response.status !== 200) {
          alert("There has been some error");
          return false;
        }

        const data = await response.json();

        const getDateCalled = () => {
          if (data.numTimesCalled === "0") {
            return null;
          } else if (data.numTimesCalled === "1") {
            return data.dateCalled0.toString().split(" ")[0];
          } else {
            return null;
          }
        };

        const getCallResponse = () => {
          if (data.numTimesCalled === "0") {
            return null;
          } else if (data.numTimesCalled === "1") {
            return data.callResponse0.toString().split(".")[1];
          } else {
            return null;
          }
        };

        const getCallNotes = () => {
          if (data.numTimesCalled === "0") {
            return null;
          } else if (data.numTimesCalled === "1") {
            return data.callNotes0;
          } else {
            return null;
          }
        };

        var row_data = {
          tNumber: data.tNumber,
          term: data.term.split(".")[1],
          year: data.year,
          wasCalled: data.wasCalled === "None" ? null : data.wasCalled,
          prevCaller: data.prevCaller === "None" ? null : data.prevCaller,
          dateCalled: getDateCalled(),
          numTimesCalled: data.numTimesCalled,
          callResponse: getCallResponse(),
          callNotes: getCallNotes(),
          wasEmailed: data.wasEmailed === "None" ? null : data.wasEmailed,
          dateEmailed: data.dateEmailed === "None" ? null : data.dateEmailed,
          emailText: data.emailText === "None" ? null : data.emailText,
        };

        setStore({
          selectedProspectSRAData: row_data,
        });
        return row_data;
      },
      getNextProspect: async () => {
        const store = getStore();
        const endpoint = `${constants.ENDPOINT_URL.PRODUCTION}/api/getNextProspect`;

        const opts = {
          method: "POST",
          headers: {
            Accept: "*",
            Authorization: "Bearer " + store.token,
          },
        };

        try {
          const response = await fetch(endpoint, opts);

          const data = await response.json();

          if (response.status !== 200) {
            return { status: data.status, msg: data.msg };
          }

          setStore({
            prospect: data.tNumber,
            callResponse: null,
            callNotes: null,
          });

          return data;
          //   window.location.href = "/";
        } catch (error) {
          console.error("Error getting prospect...");
        }
      },
      setFile: async (file) => {
        const store = getStore();
        const endpoint = `${constants.ENDPOINT_URL.PRODUCTION}/api/uploadFile`; //http://127.0.0.1:5000/api/uploadFile

        const data = new FormData();
        data.append("file", file);

        const opts = {
          method: "POST",
          headers: {
            Accept: "*",
            Authorization: "Bearer " + store.token,
          },
          body: data,
        };

        try {
          const response = await fetch(endpoint, opts);

          if (response.status !== 200) {
            alert("There has been some error");
            return false;
          }

          const data = await response.json();

          setStore({
            file: file,
          });
          return true;
          //   window.location.href = "/";
        } catch (error) {
          console.error("Error uploading...");
        }
      },
      setImportIsVisible: (bool) => {
        setStore({
          ui: { importIsVisible: bool },
        });
        return true;
      },
      setDimensions: (width, height) => {
        setStore({
          window: { width: width, height: height },
        });
        return true;
      },
      setProspectModalVisibility: (bool) => {
        setStore({
          ui: { prospectModalIsVisible: bool },
        });
        return true;
      },
      setStudentModalVisibility: (bool) => {
        setStore({
          ui: { studentModalIsVisible: bool },
        });
        return true;
      },
      setModalVisibility: (bool) => {
        setStore({
          ui: { modalIsVisible: bool },
        });
        return true;
      },
      setAnalyticModalVisibility: (bool) => {
        setStore({
          ui: { analyticsModalIsVisible: bool },
        });
        return true;
      },
      modifyStudent: async (tNumber, newData, updateFunc) => {
        const store = getStore();

        const opts = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + store.token,
          },
          body: JSON.stringify(newData),
        };
        const endpoint = `${constants.ENDPOINT_URL.PRODUCTION}/api/updateStudentInfo/${tNumber}`;

        try {
          const response = await fetch(endpoint, opts);

          if (response.status !== 200) {
            alert("There has been some error");
            return false;
          }

          const data = await response.json();

          updateFunc();
          return data;
        } catch (error) {
          console.error("Error", error);
          console.log("Error", error);
        }
      },
      /* var data = {
        status: studentData.status === "ACTIVE" ? false : true,
      };
      const res = await actions.modifyStudent(studentData.tNumber, data);
      */
      modifyUser: async (userID, newData, updateFunc) => {
        const store = getStore();

        const opts = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + store.token,
          },
          body: JSON.stringify(newData),
        };
        const endpoint = `${constants.ENDPOINT_URL.PRODUCTION}/api/updateUserInfo/${userID}`;

        try {
          const response = await fetch(endpoint, opts);

          if (response.status !== 200) {
            alert("There has been some error");
            return false;
          }

          const data = await response.json();

          updateFunc();
          return data;
        } catch (error) {
          console.error("Error", error);
          console.log("Error", error);
        }
      },
      getFullStudentInfo: async (tNumber) => {
        const store = getStore();
        const opts = {
          headers: {
            Authorization: "Bearer " + store.token,
          },
          method: "GET",
        };
        const endpoint = `${constants.ENDPOINT_URL.PRODUCTION}/api/getStudentInfo/${tNumber}`;
        // fetching data from the backend
        const response = await fetch(endpoint, opts);

        if (response.status !== 200) {
          alert("There has been some error");
          return false;
        }

        const data = await response.json();

        var row_data = {
          tNumber: data.tNumber,
          name1: data.name1,
          name2: data.name2,
          name3: data.name3,
          level: data.level,
          program: data.program,
          college: data.college,
          department: data.department,
          decision: data.decision,
          admitDate: data.admitDate,
          address1: data.address1,
          address2: data.address2,
          address3: data.address3,
          city: data.city,
          state: data.state,
          zip: data.zip,
          phone: data.phone,
          phoneExt: data.phoneExt,
          areaCode: data.areaCode,
          email: data.email,
          emailSchool: data.emailSchool,
          ethnicity: data.ethnicity,
          sex: data.sex,
          admissionType: data.admissionType,
          studentType: data.studentType,
          status: data.status === "True" ? "ACTIVE" : "INACTIVE",
        };

        return row_data;
      },
      getStudentInfo: async (tNumber) => {
        const store = getStore();
        const opts = {
          headers: {
            Authorization: "Bearer " + store.token,
          },
          method: "GET",
        };
        const endpoint = `${constants.ENDPOINT_URL.PRODUCTION}/api/getStudentInfo/${tNumber}`;
        // fetching data from the backend
        const response = await fetch(endpoint, opts);

        if (response.status !== 200) {
          alert("There has been some error");
          return false;
        }

        const data = await response.json();

        const formatPhone = (phoneNum) => {
          if (phoneNum === "0") {
            return "No Phone Number";
          } else {
            let phoneStr = phoneNum.toString();
            let firstThree = phoneStr.substring(0, 3);
            let lastFour = phoneStr.substring(3);

            return firstThree + "-" + lastFour;
          }
        };

        var areaCode = data.areaCode ? "(" + data.areaCode + ")" : "";

        var phone = data.phone ? formatPhone(data.phone) : "";

        var ext = data.phoneExt !== "None" ? " +" + data.phoneExt : "";

        var fullPhone = areaCode + phone + ext;
        var row_data = {
          tNumber: data.tNumber,
          name:
            data.name2 !== "None"
              ? data.name1 + " " + data.name2 + " " + data.name3
              : data.name1 + " " + data.name3,
          level: data.level,
          program: data.program,
          college: data.college,
          department: data.department,
          decision: data.decision,
          admitDate: data.admitDate,
          address:
            data.address3 !== "None"
              ? data.address1 + " " + data.address2 + " " + data.address3
              : data.address2 !== "None"
              ? data.address1 + " " + data.address2
              : data.address1,
          city: data.city,
          state: data.state,
          zip: data.zip,
          phone:
            formatPhone(data.phone) === "No Phone Number"
              ? "No Phone Number"
              : fullPhone,
          email: data.email,
          emailSchool: data.emailSchool,
          ethnicity: data.ethnicity,
          sex: data.sex,
          admissionType: data.admissionType,
          studentType: data.studentType,
          status: data.status === "True" ? "ACTIVE" : "INACTIVE",
        };

        setStore({
          ui: { selectedStudentData: row_data },
        });
        return row_data;
      },
      getUserInfo: async (userID) => {
        const store = getStore();
        const opts = {
          headers: {
            Authorization: "Bearer " + store.token,
          },
          method: "GET",
        };
        const endpoint = `${constants.ENDPOINT_URL.PRODUCTION}/api/getUserInfo/${userID}`;
        // fetching data from the backend
        const response = await fetch(endpoint, opts);

        if (response.status !== 200) {
          alert("There has been some error");
          return false;
        }

        const data = await response.json();

        function padLeadingZeros(num, size) {
          var s = num + "";
          while (s.length < size) s = "0" + s;
          return s;
        }

        var row_data = {
          id: padLeadingZeros(data.id, 6),
          name: data.name,
          username: data.username,
          email: data.email,
          accessLevel: data.accessLevel.split(".")[1].toUpperCase(),
          time_created: data.time_created.split(" ")[0],
          status: data.activationStatus === "True" ? "ACTIVE" : "INACTIVE",
        };

        setStore({
          ui: { selectedUserData: row_data },
        });
        return row_data;
      },
      updateSelectedStudent: async (tNumber) => {
        setStore({
          ui: { selectedStudent: tNumber },
        });
        return true;
      },
      updateSelectedUserID: async (userID) => {
        setStore({
          ui: { selectedUserID: userID },
        });
        return true;
      },
      register: async (
        nameInput,
        usernameInput,
        emailInput,
        passwordInput,
        accessLevelInput
      ) => {
        const headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
        };

        const endpoint = `${constants.ENDPOINT_URL.PRODUCTION}/register`;

        var newData = {
          name: nameInput,
          username: usernameInput,
          email: emailInput,
          password: passwordInput,
          "access-level": accessLevelInput,
        };

        // fetch(endpoint, {
        //   method: "POST",
        //   headers: headers,
        //   body: JSON.stringify(data),
        // })
        //   .then((response) => {
        //     return response.json();
        //   })
        //   .then((data) => {
        //     window.location.assign("/");
        //     return data;
        //   })
        //   .catch((error) => {
        //     console.error(
        //       "There was an error with your request. Try again.\nError: " +
        //         error
        //     );
        //   });

        // return true;
        try {
          const response = await fetch(endpoint, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(newData),
          });

          const data = await response.json();

          if (response.status !== 200) {
            return { status: data.status, msg: data.msg };
          }

          window.location.href = "/";

          return data;
        } catch (error) {
          return error;
          //alert("There has been an error logging in.");
        }
      },
      login: async (usernameInput, passwordInput) => {
        const endpoint = `${constants.ENDPOINT_URL.PRODUCTION}/token`; //http://127.0.0.1:5000/token
        const headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
        };

        var userData = {
          username: usernameInput,
          password: passwordInput,
        };

        try {
          const response = await fetch(endpoint, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(userData),
          });

          const data = await response.json();

          if (response.status !== 200) {
            return { status: data.status, msg: data.msg };
          }

          const parseAccessLevelStr = (string) => {
            const capitalize = (str) => {
              if (typeof str === "string") {
                return str.replace(/^\w/, (c) => c.toUpperCase());
              } else {
                return "";
              }
            };
            return capitalize(string.split(".")[1]); //accessLevel.caller
          };

          let formattedAccessLevel = parseAccessLevelStr(data.access_level);
          sessionStorage.setItem("token", data.access_token);
          sessionStorage.setItem("username", data.username);
          sessionStorage.setItem("email", data.email);
          sessionStorage.setItem("access_level", formattedAccessLevel);
          setStore({
            token: data.access_token,
            user: {
              username: data.username,
              email: data.email,
              access_level: formattedAccessLevel,
            },
          });
          //   window.location.href = "/";
        } catch (error) {
          return error;
          //alert("There has been an error logging in.");
        }
      },
      logout: () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("access_level");
        console.log("Logging out...");
        setStore({
          token: null,
          user: { username: null, email: null, access_level: null },
        });
      },
      syncTokenFromSessionStore: () => {
        const token = sessionStorage.getItem("token");
        const username = sessionStorage.getItem("username");
        const email = sessionStorage.getItem("email");
        const access_level = sessionStorage.getItem("access_level");
        console.log("Application just loaded; syncing session storage");
        if (token && token !== "" && token !== null) {
          setStore({
            token: token,
            user: {
              username: username,
              email: email,
              access_level: access_level,
            },
          });
        }
      },
      setDecisionBtnHeight: (size) => {
        setStore({
          decisionBtnHeight: size,
        });
      },
      getMessage: () => {
        const store = getStore();
        const opts = {
          headers: {
            Authorization: "Bearer " + store.token,
          },
        };
        const endpoint = `${constants.ENDPOINT_URL.PRODUCTION}/message`;
        // fetching data from the backend
        fetch(endpoint, opts)
          .then((resp) => resp.json())
          .then((data) => setStore({ message: data.message }))
          .catch((error) =>
            console.log("Error loading message from backend", error)
          );
      },
      updateRequestDecision: async (data, isApproved) => {
        const store = getStore();

        var newData = {
          username: data.username,
          decision: isApproved ? "approve" : "deny",
        };
        const opts = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + store.token,
          },
          body: JSON.stringify(newData),
        };
        const endpoint = `${constants.ENDPOINT_URL.PRODUCTION}/api/updateRegistrationRequests`;

        try {
          const response = await fetch(endpoint, opts);

          if (response.status !== 200) {
            alert("There has been some error");
            return false;
          }

          const data = await response.json();

          return data;
        } catch (error) {
          console.error("Error", error);
          console.log("Error", error);
        }
      },
      getRegistrationRequests: async () => {
        const store = getStore();
        const opts = {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + store.token,
          },
        };
        const endpoint = `${constants.ENDPOINT_URL.PRODUCTION}/api/getRegistrationRequests`;

        try {
          const response = await fetch(endpoint, opts);

          if (response.status !== 200) {
            alert("There has been some error");
            return false;
          }

          const data = await response.json();
          var count = Object.keys(data[0]).length;

          var new_data = [];

          function padLeadingZeros(num, size) {
            var s = num + "";
            while (s.length < size) s = "0" + s;
            return s;
          }

          for (let i = 0; i < count; i++) {
            var row = data[0][i];
            var row_data = {
              request_id: padLeadingZeros(row.id, 6),
              name: row.name,
              username: row.username,
              email: row.email,
              access_level: row.accessLevel.split(".")[1].toUpperCase(),
              date_created: row.time_created.split(" ")[0],
            };
            new_data.push(row_data);
          }

          setStore({ requests: new_data });
          // updateRowsFunc(new_data);
          return new_data;
        } catch (error) {
          console.error("Error", error);
          console.log("Error", error);
        }
      },
      getCallers: async () => {
        const store = getStore();

        const opts = {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + store.token,
          },
        };

        const endpoint = `${constants.ENDPOINT_URL.PRODUCTION}/api/getCallers`;

        try {
          const response = await fetch(endpoint, opts);

          if (response.status !== 200) {
            alert("There has been some error");
            return false;
          }

          const data = await response.json();
          var count = Object.keys(data[0]).length;

          var new_data = [];

          function padLeadingZeros(num, size) {
            var s = num + "";
            while (s.length < size) s = "0" + s;
            return s;
          }

          for (let i = 0; i < count; i++) {
            var row = data[0][i];
            var row_data = {
              user_id: padLeadingZeros(row.id, 6),
              name: row.name,
              access_level: row.accessLevel.split(".")[1].toUpperCase(),
              date_created: row.time_created.split(" ")[0],
              status: row.activationStatus === "True" ? "ACTIVE" : "INACTIVE",
            };
            new_data.push(row_data);
          }

          setStore({ requests: new_data });
          return new_data;
        } catch (error) {
          console.error("Error", error);
          console.log("Error", error);
        }
      },
      getStudents: async () => {
        const store = getStore();

        //define the type of HTTP request and content type and authorization
        const opts = {
          method: "GET",
          headers: {
            Authorization: "Bearer " + store.token,
          },
        };

        const endpoint = `${constants.ENDPOINT_URL.PRODUCTION}/api/getStudents`;

        try {
          const response = await fetch(endpoint, opts);

          //throw an error is status isn't ok
          if (response.status !== 200) {
            alert("There has been some error");
            return false;
          }

          const data = await response.json();
          var count = Object.keys(data[0]).length;

          var new_data = [];

          //set the student data
          for (let i = 0; i < count; i++) {
            var row = data[0][i];
            var row_data = {
              tNumber: row.tNumber,
              name:
                row.name2 !== "None"
                  ? row.name1 + " " + row.name2 + " " + row.name3
                  : row.name1 + " " + row.name3,
              email: row.email,
              status: row.status === "True" ? "ACTIVE" : "INACTIVE",
            };
            new_data.push(row_data);
          }
          return new_data;
        } catch (error) {
          console.log("Error", error);
        }
      },
      getStudentsSRA: async () => {
        const store = getStore();

        //define the type of HTTP request and content type and authorization
        const opts = {
          method: "GET",
          headers: {
            Authorization: "Bearer " + store.token,
          },
        };

        const endpoint = `${constants.ENDPOINT_URL.PRODUCTION}/api/getStudentsSRA`;

        try {
          const response = await fetch(endpoint, opts);

          //throw an error is status isn't ok
          if (response.status !== 200) {
            alert("There has been some error");
            return false;
          }

          const data = await response.json();
          var count = Object.keys(data[0]).length;

          var new_data = [];

          //set the student data
          for (let i = 0; i < count; i++) {
            var row = data[0][i];
            var row_data = {
              tNumber: row.tNumber,
              name:
                row.name2 !== "None"
                  ? row.name1 + " " + row.name2 + " " + row.name3
                  : row.name1 + " " + row.name3,
              wasCalled: row.wasCalled ? "Yes" : "No",
              wasEmailed: row.wasEmailed ? "Yes" : "No",
              numTimesCalled: row.numTimesCalled,
              callResponse0: row.callResponse0 ? row.callResponse0 : "N/A",
              callResponse1: row.callResponse1 ? row.callResponse1 : "N/A",
              ethnicity: row.ethnicity ? row.ethnicity : "N/A",
              sex: row.sex ? row.sex : "N/A",
              program: row.program ? row.program : "N/A",
              college: row.college ? row.college : "N/A",
              department: row.department ? row.department : "N/A",
            };
            new_data.push(row_data);
          }
          return new_data;
        } catch (error) {
          console.log("Error", error);
        }
      },
    },
  };
};

export default getState;
