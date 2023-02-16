import React, { useEffect } from "react";
import { Provider } from "react-redux";
import store from "./store/store";
import { BrowserRouter } from "react-router-dom";
import "./App.scss";
import RoutesNav from "./routesNav";

// import { useAzureAD, usePingID, logout } from "./components/Authentication";

function App() {
  // const { userInfo: aadUserInfo, accessToken } = useAzureAD();
  // const { userInfo: pingIdUserInfo } = usePingID;

  // useEffect(() => {
  //   if (aadUserInfo && pingIdUserInfo) {
  //     console.log(
  //       "Both AAD and PingID authentication were successful. Performing SSO logic..."
  //     );
  //     // Perform the SSO logic, for example by storing the user information in local storage or making an API call to your backend to exchange the user information between the two systems.
  //     // console.log("Hello", aadUserInfo.displayName);
  //     // console.log("Your access token is", accessToken);
  //   }
  // }, [aadUserInfo, pingIdUserInfo]);

  return (
    <>
      <Provider store={store}>
        <React.StrictMode>
          <BrowserRouter>
            <RoutesNav />
          </BrowserRouter>
        </React.StrictMode>
      </Provider>
    </>
  );
}

export default App;
