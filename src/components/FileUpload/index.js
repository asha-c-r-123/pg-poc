import { BlobServiceClient } from "@azure/storage-blob";

const blobServiceClient = new BlobServiceClient("<your-connection-string>");

export const uploadFile = (file) => async (dispatch) => {
  dispatch({ type: "UPLOAD_FILE_PENDING" });

  try {
    const containerClient = blobServiceClient.getContainerClient(
      "<your-container-name>"
    );

    const blobName = file.name;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadBrowserData(file);

    dispatch({
      type: "UPLOAD_FILE_SUCCESS",
      payload: blockBlobClient.url,
    });
  } catch (error) {
    console.error(error);
    dispatch({ type: "UPLOAD_FILE_ERROR", error });
  }
};
