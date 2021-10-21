import * as constants from "../utils/Constants";

const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
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
          console.log(data);
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
        // Iterate over the property names:
        // for (let key of Object.keys(data)) {
        //   var value = data[key];
        //   console.log(key, value);
        // }

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

      getRegistrationRequests: async (/*{ updateRowsFunc }*/) => {
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
        // fetching data from the backend

        // console.log("Updating rows...");
        // fetch(endpoint, opts)
        //   .then((response) => {
        //     return response.json();
        //   })
        //   .then((data) => {
        //     console.log(data);
        //     var count = Object.keys(data[0]).length;

        //     setStore({ requests: data[0] });
        //     console.log(store.requests);
        //     console.log("Updated rows.");
        //   })
        //   .catch((error) => {
        //     console.error(
        //       "There was an error with your request. Try again.\nError: " +
        //         error
        //     );
        //   });

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
    },
  };
};

export default getState;
