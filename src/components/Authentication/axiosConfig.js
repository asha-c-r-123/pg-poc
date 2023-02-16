import { SilentRequest } from "@azure/msal-browser";
import axios from "axios";
import baseURL from "shared/configs/baseURL";
import { msalInstance } from "shared/configs/msalConfig";

const axiosInstance = axios.create({
  ...baseURL,
});

const getToken = async () => {
  let token = "";
  const accounts = msalInstance.getAllAccounts();

  if (accounts.length) {
    const request = {
      scopes: ["User.Read"],
      account: accounts[0],
    };

    const tokenObject = await msalInstance.acquireTokenSilent(request);
    token = tokenObject.accessToken;
  }

  return token;
};

axiosInstance.interceptors.request.use((config) => {
  return new Promise((resolve, reject) => {
    getToken().then((token) => {
      if (!!token) {
        config.headers.accept = "application/json";
        config.headers["Content-Type"] = "application/json";
        config.headers["Authorization"] = token;
        resolve(config);
      } else {
        reject(config);
      }
    });
  });
});

export default axiosInstance;
