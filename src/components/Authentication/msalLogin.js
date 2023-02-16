import React from "react";
import {
  AuthenticatedTemplate,
  MsalProvider,
  UnauthenticatedTemplate,
  useAccount,
  useMsal,
} from "@azure/msal-react";
import { InteractionStatus, SilentRequest } from "@azure/msal-browser";
import { msalInstance } from "shared/configs/msalConfig";
import Loader from "components/__ui/Loader";

const login = () => {
  const request = {
    scopes: ["User.Read"],
  };
  msalInstance.loginRedirect(request);
};

const LoginRedirect = () => {
  const { accounts, inProgress } = useMsal();
  const filteredAccount = accounts.find(
    (a) => (a.username?.indexOf("@pg.com") ?? -1) > 0
  );
  const account = useAccount(filteredAccount || {});

  if (inProgress === InteractionStatus.None && !account) {
    login();
    return null;
  }

  return <Loader />;
};

export const SecuredApp = (Component) => (props) => {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthenticatedTemplate>
        <Component {...props} />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <LoginRedirect />
      </UnauthenticatedTemplate>
    </MsalProvider>
  );
};
