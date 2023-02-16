import {
  AccountInfo,
  AuthenticationResult,
  EndSessionRequest,
  EventType,
  InteractionRequiredAuthError,
  PublicClientApplication,
  RedirectRequest,
  SilentRequest,
} from "@azure/msal-browser";

function getReplyUrl() {
  let url = new URL(window.location.href);
  return url.protocol + "//" + url.host + "/";
}

class MsalContext {
  msalInstance = null;
  account = null;
  redirectTokenRequest = null;
  redirectGraphRequest = null;
  silentTokenRequest = null;
  silentGraphRequest = null;
  msalConfig = {
    auth: {
      clientId: "",
      authority:
        "https://login.microsoftonline.com/siemensgamesa.onmicrosoft.com",
      scopes: ["User.Read", "User.Read.All"],
      navigateToLoginRequestUrl: true,
      redirectUri: getReplyUrl(),
    },
    cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: false,
    },
  };
  applicationConfig = {
    clientId: "",
    scopes: ["User.Read", "User.Read.All"],
    authority:
      "https://login.microsoftonline.com/siemensgamesa.onmicrosoft.com",
  };

  initializeMsal = (conf) => {
    this.msalConfig.auth.clientId = conf.ApplicationId;
    this.msalInstance = new PublicClientApplication(this.msalConfig);
    this.setRequestObjects();
    this.applicationConfig.clientId = conf.ApplicationId;
  };

  setRequestObjects = () => {
    this.redirectTokenRequest = {
      scopes: [this.applicationConfig.clientId],
      redirectStartPage: window.location.href,
    };
    this.redirectGraphRequest = {
      scopes: this.applicationConfig.scopes,
      redirectStartPage: window.location.href,
    };

    this.silentTokenRequest = {
      scopes: this.applicationConfig.scopes,
      account: this.account,
      forceRefresh: false,
    };

    this.silentGraphRequest = {
      scopes: this.applicationConfig.scopes,
      account: this.account,
      forceRefresh: false,
    };
  };

  get MsalInstance() {
    return this.msalInstance;
  }

  NULL_USER = {
    environment: "",
    homeAccountId: "",
    tenantId: "",
    username: "",
    localAccountId: "",
  };
  loadAuthModule = () => {
    return new Promise((resolve, reject) => {
      this.msalInstance
        .handleRedirectPromise()
        .then((resp) => {
          this.handleResponse(resp);
          resolve();
        })
        .catch((e) => {
          console.error(e);
          reject(e);
        });

      this.msalInstance.addEventCallback((event) => {
        if (event.eventType === "loginSuccess" && event.payload.account) {
          const account = event.payload.account;
          this.msalInstance.setAccount(account);
        }
      });
    });
  };

  handleResponse(response) {
    if (response && response.account) {
      this.account = response.account;
    } else {
      this.account = this.getAccount();
    }
  }

  login(loginCallback) {
    if (this.account !== this.NULL_USER) {
      loginCallback();
    } else {
      this.msalInstance.loginRedirect(this.applicationConfig).catch((e) => {
        console.error(e);
      });
    }
  }

  logout() {
    const logOutRequest = { account: this.account };
    this.msalInstance.logout(logOutRequest);
  }

  async getTokenOrRedirect() {
    this.silentTokenRequest.account = this.account;
    return this.getTokenSilentOrRedirect(
      this.silentTokenRequest,
      this.redirectTokenRequest
    );
  }

  async getGraphTokenOrRedirect() {
    this.silentGraphRequest.account = this.account;
    return this.getTokenSilentOrRedirect(
      this.silentTokenRequest,
      this.redirectGraphRequest
    );
  }
  getAccount() {
    const currentAccounts = this.msalInstance.getAllAccounts();
    if (!currentAccounts || currentAccounts.length === 0) {
      console.debug("No accounts logged in");
      return this.NULL_USER;
    }

    if (currentAccounts.length > 1) {
      console.debug(
        "Multiple accounts detected, need to add choose account code."
      );
      return currentAccounts[0];
    }
    if (currentAccounts.length === 1) {
      return currentAccounts[0];
    }

    return this.NULL_USER;
  }

  getTokenSilentOrRedirect = (silentRequest, interactiveRequest) => {
    return new Promise((resolve, reject) => {
      if (this.account !== this.NULL_USER) {
        this.msalInstance
          .acquireTokenSilent(silentRequest)
          .then((response) => {
            resolve(response);
          })
          .catch((e) => {
            if (e instanceof InteractionRequiredAuthError) {
              this.msalInstance
                .acquireTokenRedirect(interactiveRequest)
                .then(() => reject())
                .catch((e2) => {
                  console.error(e2);
                  return reject(e2);
                });
            } else {
              console.error(e);
              return reject(e);
            }
          });
      } else {
        this.msalInstance
          .acquireTokenRedirect(interactiveRequest)
          .then(() => reject())
          .catch((e2) => {
            console.error(e2);
            return reject(e2);
          });
      }
    });
  };
}

const msalContext = new MsalContext();
export default msalContext;
