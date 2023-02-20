import { useState, useEffect } from "react";

function getProofScopeURL(
  //   context,
  //   strType,
  //   strName,
  //   strRevision,
  strFileName
  //   strVersion,
  //   mlVersions
) {
  let viewerURLOutput = "";
  let responseMap = {};
  let isError = false;
  let strMessage = "";
  let os = null;

  let mpPOAInfo = isFAApprovalTaskExist(context, strType, strName, strRevision);
  let isFATaskExist = mpPOAInfo.isFATaskActive;
  let strWCRFilePath = mpPOAInfo.WCRFilePath;

  if (strType === AWLType.ARTWORK_FILE) {
    let mlCICVersion = getCICFiles(context, TYPE_PGAAA_CIC, strName, "");
    if (mlCICVersion && mlCICVersion.length) {
      mlVersions.push(...mlCICVersion);
    }
  }

  let iSize = mlVersions.length;
  let strFile = null;
  let slFiles = [];
  let sbURL = null;

  if (BusinessUtil.isNotNullOrEmpty(mlVersions)) {
    let sb = new StringBuilder(strClowdFlowFilePath);
    let mpVersionMap = null;
    let strFolderName = null;
    let strExt = "";
    let strVersionInfo = "";
    let strVersionFileName = "";
    let strVersionType = "";
    let strFileExtension = "";
    for (let i = 0; i < mlVersions.length; i++) {
      mpVersionMap = mlVersions[i];
      strVersionInfo = mpVersionMap[DomainConstants.SELECT_REVISION];
      strVersionFileName = mpVersionMap[DomainConstants.SELECT_ATTRIBUTE_TITLE];
      strFileExtension = getFileExtension(strVersionFileName);
      strVersionFileName = appendVersionInFileName(
        strVersionFileName,
        strVersionInfo,
        strFileExtension
      );
      strVersionType = mpVersionMap[DomainConstants.SELECT_TYPE];
      strType = mpVersionMap[DomainConstants.SELECT_TYPE];

      if (strVersionType !== AWLType.ARTWORK_FILE) {
        strName = strName.replace("POA", "CIC");
      }

      sbURL = new StringBuilder(sb.toString())
        .append(strType)
        .append("/")
        .append(strName);

      if (strVersionType === AWLType.ARTWORK_FILE) {
        sbURL.append("/").append(strRevision);
      }

      sbURL.append("/").append(strVersionInfo);
      sbURL.append("/").append(strVersionFileName);

      slFiles.push(sbURL.toString().replace(SPACE, SPACE_ENCODING));
    }

    if (BusinessUtil.isNotNullOrEmpty(strWCRFilePath)) {
      strWCRFilePath = strWCRFilePath.replace(SPACE, SPACE_ENCODING);
      slFiles.push(strWCRFilePath);
    }

    strFile = slFiles;
  }

  try {
    let strSession = getSession();
    let json = {};
    let uri = null;
    let strQuery = "";
    let strDecodedURL = "";
    let jsonVariable = {};
    json.method = "hub.process_from_whitepaper_with_options";

    if (isFATaskExist) {
      json.whitepaper_name = "api_starter_kit";
      jsonVariable.can_delete_notes = true;
      jsonVariable.can_view_only = false;
    } else {
      json.whitepaper_name = "api_starter_kit";
      jsonVariable.can_delete_notes = true;
      jsonVariable.can_view_only = true;
    }

    json.input_name = "get_proofscope_url";
    jsonVariable.email = "awltest4.im@pg.com";
    jsonVariable.username = "awltest4.im";
    jsonVariable.file_urls = strFile;
    // Set the expiry time in minutes
    jsonVariable.expiry_in_minutes = "20";

    // Set the user's email and username
    // jsonVariable.email = getPersonEmailAddress(context);
    // jsonVariable.username = context.getUser();

    // Set the session id
    json.session = strSession;

    // Create a URL object for the ProofScope server
    let url = new URL(strProofScopeURL);

    // Open a connection to the ProofScope server
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Content-Language", "en-US");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let output = xhr.responseText;
        let obj = JSON.parse(output.trim());
        if (obj.hasOwnProperty("status")) {
          // There was an error
          obj = obj.contents;
          let strMessage = obj.last_error;

          if (strMessage && strMessage.includes("assets not found")) {
            // Do something for proofScopeCheckinAction()
          }

          let isError = true;
          let responseMap = {
            viewerURL: viewerURLOutput,
            isError: isError,
            Message: strMessage,
          };
          return responseMap;
        } else if (obj.hasOwnProperty("proofscope_url_session")) {
          // The request was successful
          viewerURLOutput = obj.proofscope_url_session;
          let urit = new URL(viewerURLOutput);
          strDecodedURL = decodeURIComponent(viewerURLOutput);
          uri = new URL(strDecodedURL);
          strQuery = uri.search
            .replace("%", "%25")
            .replace("/", "%2f")
            .replace("+", "%2b");
          let isError = false;
          let responseMap = {
            viewerURL: viewerURLOutput,
            isError: isError,
            Message: "",
          };
          return responseMap;
        }
      }
    };

    // Write the JSON string to the output stream of the connection
    xhr.send(JSON.stringify(json));
  } catch (e) {
    console.error(e);
  }
}

function getProofScopeViewerURL(context, args) {
  let programMap = JPO.unpackArgs(args);
  let strEskoViewableId = programMap.get("EskoViewableObjId");
  let strFileName = programMap.get("FileName");
  let mlVersions = programMap.get("versions");
  let strType = "";
  let strName = "";
  let strRevision = "";
  let strVersion = "";

  if (strEskoViewableId.includes("|")) {
    let slEskoViewableId = strEskoViewableId.split("|");
    strType = slEskoViewableId[0];
    strName = slEskoViewableId[1];
    strRevision = slEskoViewableId[2];
    strVersion = slEskoViewableId[3];
  } else {
    strName = strEskoViewableId;
  }

  return getProofScopeURL(
    context,
    strType,
    strName,
    strRevision,
    strFileName,
    strVersion,
    mlVersions
  );
}

let responseMap = await jpoInvoke(
  "pgRTAProofScopeViewerUtil",
  getProofScopeViewerURL,
  programMap
);
let isError = responseMap.isError;
let strMessage = responseMap.Message;
let strViewerURL = responseMap.viewerURL;

async function jpoInvoke(jpoName, methodName, args) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    const url = `/PLM/programcentral/JPO.jsp?&jpo=${jpoName}&method=${methodName}`;
    req.open("POST", url, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        if (req.status === 200) {
          try {
            const response = JSON.parse(req.responseText);
            resolve(response);
          } catch (error) {
            reject(error);
          }
        } else {
          reject(new Error(`JPO request failed with status ${req.status}`));
        }
      }
    };
    req.send(JSON.stringify(args));
  });
}
