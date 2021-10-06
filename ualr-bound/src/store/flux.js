import * as constants from "../utils/Constants";

const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      token: null,
      message: null,
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
          sessionStorage.setItem("token", data.access_token);
          setStore({ token: data.access_token });
          //   window.location.href = "/";
        } catch (error) {
          console.error("There has been an error logging in.");
          alert("There has been an error logging in.");
        }
      },

      logout: () => {
        sessionStorage.removeItem("token");
        console.log("Logging out...");
        setStore({ token: null });
      },

      syncTokenFromSessionStore: () => {
        const token = sessionStorage.getItem("token");
        console.log("Application just loaded; syncing session storage");
        if (token && token !== "" && token !== null) setStore({ token: token });
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
    },
  };
};

export default getState;
