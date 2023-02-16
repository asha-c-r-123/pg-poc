import { Configuration, PublicClientApplication } from "@azure/msal-browser";

const TENANT_ID = "pg.com";
const CLIENT_ID = "";

const msalConfiguration = {
  auth: {
    authority: `https://login.microsoftonline.com/${TENANT_ID}`,
    clientId: CLIENT_ID,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const msalInstance = new PublicClientApplication(msalConfiguration);
