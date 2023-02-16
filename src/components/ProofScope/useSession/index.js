import React from "react";
import axios from "axios";
import { fromByteArray } from "base64-js";

export const CreateSession = async (
  strProofScopeURL,
  strProofScopeAdminUserName,
  strProofScopeAdminPass
) => {
  try {
    const decodedPassword = strProofScopeAdminPass;

    const json = JSON.stringify({
      method: "auth.create_session",
      user_name: strProofScopeAdminUserName,
      options: {
        password: decodedPassword,
        expiry: 120,
      },
    });

    const response = await axios.post(strProofScopeURL, json, {
      headers: {
        "Content-Type": "application/json",
        "Content-Language": "en-US",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
    });

    const strSession = response.data;
    return strSession;
  } catch (error) {
    console.error(error);
    return null;
  }
};
