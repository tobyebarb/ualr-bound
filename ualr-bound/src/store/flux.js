import { useRef } from "react";
import * as constants from "../utils/Constants";

const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      file: null,
      window: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      modalIsVisible: false,
      ui: {
        modalIsVisible: false,
        importIsVisible: false,
        selectedUserID: null,
        selectedUserData: null,
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
      setFile: async (file) => {
        const store = getStore();
        const endpoint = `${constants.ENDPOINT_URL.LOCAL}/api/uploadFile`; //http://127.0.0.1:5000/api/uploadFile

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
        console.log("Width", width);
        console.log("Height", height);
        setStore({
          window: { width: width, height: height },
        });
        return true;
      },
      setModalVisibility: (bool) => {
        setStore({
          ui: { modalIsVisible: bool },
        });
        return true;
      },
      modifyUser: async (userID, newData) => {
        const store = getStore();

        console.log(newData);

        const opts = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + store.token,
          },
          body: JSON.stringify(newData),
        };
        const endpoint = `${constants.ENDPOINT_URL.LOCAL}/api/updateUserInfo/${userID}`;

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
      getUserInfo: async (userID) => {
        const store = getStore();
        const opts = {
          headers: {
            Authorization: "Bearer " + store.token,
          },
          method: "GET",
        };
        const endpoint = `${constants.ENDPOINT_URL.LOCAL}/api/getUserInfo/${userID}`;
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

        console.log(row_data);

        setStore({
          ui: { selectedUserData: row_data },
        });
        return row_data;
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

        const endpoint = `${constants.ENDPOINT_URL.LOCAL}/register`;

        var data = {
          name: nameInput,
          username: usernameInput,
          email: emailInput,
          password: passwordInput,
          "access-level": accessLevelInput,
        };

        fetch(endpoint, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(data),
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            console.log(data);
            window.location.assign("/");
          })
          .catch((error) => {
            console.error(
              "There was an error with your request. Try again.\nError: " +
                error
            );
          });

        return true;
      },
      login: async (usernameInput, passwordInput) => {
        const endpoint = `${constants.ENDPOINT_URL.LOCAL}/token`; //http://127.0.0.1:5000/token
        const headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
        };
        if (!usernameInput || !passwordInput) {
          alert("Please fill out required fields.");
          return 0;
        }

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

          if (response.status !== 200) {
            alert("There has been some error");
            return false;
          }

          const data = await response.json();
          sessionStorage.setItem("token", data.access_token);
          sessionStorage.setItem("username", data.username);
          sessionStorage.setItem("email", data.email);
          sessionStorage.setItem("access_level", data.access_level);
          setStore({
            token: data.access_token,
            user: {
              username: data.username,
              email: data.email,
              access_level: data.access_level,
            },
          });
          //   window.location.href = "/";
        } catch (error) {
          console.error("There has been an error logging in.");
          alert("There has been an error logging in.");
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
        console.log("Setting decision button height to " + size);
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
        const endpoint = `${constants.ENDPOINT_URL.LOCAL}/message`;
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
        console.log("newData:", newData);
        const opts = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + store.token,
          },
          body: JSON.stringify(newData),
        };
        const endpoint = `${constants.ENDPOINT_URL.LOCAL}/api/updateRegistrationRequests`;

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
        const endpoint = `${constants.ENDPOINT_URL.LOCAL}/api/getRegistrationRequests`;

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
          console.log("Updated rows.", store.requests);
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

        const endpoint = `${constants.ENDPOINT_URL.LOCAL}/api/getCallers`;

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

          console.log("DATA: ", new_data);

          setStore({ requests: new_data });
          // updateRowsFunc(new_data);
          console.log("Updated rows.", store.requests);
          return new_data;
        } catch (error) {
          console.error("Error", error);
          console.log("Error", error);
        }
      },
      /*getStudents: async () => {
        const store = getStore();
        
        //define the type of HTTP request and content type and authorization
        const opts = {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer" + store.token,
          },
        };

        const enpoint = '${constants.ENDPOINT_URL.LOCAL}/api/getStudents';

        try {
          const response = await fetch(endpoint, opts);
          
          //throw an error is status isn't ok
          if(response.status !== 200) {
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
              TNumber: row.TNumber,
              name: row.firstName + row.lastName,
              email: row.email,
              status: row.activationStatus === "True" ? "ACTIVE" : "INACTIVE"
            };
            new_data.push(row_data);
          }
          return new_data;
        } catch (eror){
          console.error("Error", error);
          console.log("Error", error);
        }
      };
      */
    },
  };
};

export default getState;
