import { CreateSession } from "../../components/ProofScope/useSession";
import axios from "axios";

export const UploadFileToServer =
  (strFileName, strWrokspacePath) => async (dispatch) => {
    try {
      const sessionCreate = await CreateSession(
        "http://azw-aac-hybrid1.np-cloud-pg.com:9090/",
        // "https://proofscopenp.pg.com/",
        "admin",
        "admin"
      );
      const strSession = JSON.parse(JSON.stringify(sessionCreate)).session;

      const file = new File([strWrokspacePath], strFileName);
      const strProofScopeURL =
        "http://azw-aac-hybrid1.np-cloud-pg.com:9090/portal.cgi";
      //  const strProofScopeURL =
      //    "http://azw-aac-hybrid1.np-cloud-pg.com:9090/portal.cgi";
      const strProofScopeUploadURL = `${strProofScopeURL}?hub=upload_file&whitepaper_name=api_starter_kit&input_name=receive_file_auth&session=${strSession}`;
      const formData = new FormData();
      formData.append("file", file, strFileName);

      const response = await axios.post(strProofScopeUploadURL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = response.data;
      const jsonArray = data.files;
      const responseMsg = jsonArray[0];
      const movedPath = await moveFileToFolder(
        jsonArray,
        strSession,
        strFileName
      );

      dispatch({
        type: "UPLOAD_FILE_SUCCESS",
        payload: { responseMsg, movedPath },
      });
    } catch (error) {
      dispatch({
        type: "UPLOAD_FILE_FAILURE",
        payload: { error: error.message },
      });
    }
  };

const moveFileToFolder = async (strPath, strSession, strType) => {
  let strReturnPath = null;
  let strUrlParam = "http://azw-aac-hybrid1.np-cloud-pg.com:9090/portal.cgi";
  //azw-aac-hybrid1.np-cloud-pg.com:9090/portal.cgi
  http: if (strType === "Artwork File") {
    strType = "Artwork%20File";
  } else if (strType === "CIC") {
    strType = "CIC";
  }

  let sbPath = "cloudflow://PP_FILE_STORE/aacdata";

  try {
    let json = {
      method: "hub.process_from_whitepaper_with_files_and_variables",
      whitepaper_name: "api_starter_kit",
      input_name: "move_file",
      files: strPath,
      variables: {
        to_file_or_folder: sbPath,
        options: {
          overwrite: true,
          create_folders: true,
          unique_name_mode: "Sequential",
          delete_enclosing_folder: true,
        },
      },
      session: strSession,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Content-Language": "en-US",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
    };
    const response = await axios.post(
      strUrlParam,
      JSON.stringify(json),
      config
    );
    if (response.status === 200) {
      const jsonResp = response.data;
      let jsonObjArray = jsonResp.files;
      strReturnPath = jsonObjArray[0];
      console.log("strReturnPath>>>" + strReturnPath);
    }
  } catch (exception) {
    console.log(exception.message);
  }
  return strReturnPath;
};
