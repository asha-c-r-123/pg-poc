import React, { useState, useEffect } from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import { PingID } from "@ping-identity/pf-authn-js-widget";

const msalConfig = {
  auth: {
    clientId: "<YOUR_CLIENT_ID>",
    authority: "https://login.microsoftonline.com/<YOUR_TENANT_ID>",
  },
};
const msalClient = new PublicClientApplication(msalConfig);

export const useAzureAD = () => {
  const [userInfo, setUserInfo] = useState({});
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    const msalClient = new PublicClientApplication(msalConfig);

    const getUserInfo = async () => {
      // Check if the user is already signed in
      const accounts = await msalClient.getAllAccounts();
      if (!accounts || accounts.length === 0) {
        // If the user is not signed in, redirect the user to the Azure AD sign-in page
        msalClient.loginRedirect();
        return;
      }

      // Get the user's access token for the Microsoft Graph API
      const accessToken = await msalClient.acquireTokenSilent({
        scopes: ["https://graph.microsoft.com/.default"],
      });

      // Use the access token to call the Microsoft Graph API and retrieve the user's profile information
      const response = await fetch("https://graph.microsoft.com/v1.0/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const user = await response.json();

      // Store the user's information in state
      setUserInfo(user);
      setAccessToken(accessToken);
    };

    getUserInfo();
  }, []);

  return { userInfo, accessToken };
};

export const usePingID = (accessToken) => {
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    // Use the PingID SDK to implement the SSO functionality
    if (accessToken) {
      PingID.init({
        accessToken,
        onSuccess: (user) => {
          // Store the user's information in state
          setUserInfo(user);
        },
        onError: (error) => {
          console.error(error);
        },
      });
    }
  }, [accessToken]);

  return { userInfo };
};
export const logout = () => {
  msalClient.logout();
  msalClient.logoutRedirect();
};
