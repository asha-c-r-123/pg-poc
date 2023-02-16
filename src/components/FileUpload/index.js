import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { uploadFile, uploadFileError } from "../../store/actions/UserActions";
import { BlobServiceClient } from "@azure/storage-blob";

const UploadFile = (props) => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [connectionString] = useState(props.connectionString);
  const [containerName] = useState(props.containerName);
  const [url, setUrl] = useState(null);
  const error = useSelector((state) => state.error);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      alert(`An error occurred: ${error}`);
    }
  }, [error]);

  useEffect(() => {
    if (url) {
      props.onUpload(url);
    }
  }, [url, props.onUpload]);

  const handleUpload = async () => {
    try {
      const file = fileInputRef.current.files[0];
      const payload = { file, connectionString, containerName };
      dispatch(uploadFile(payload));

      // Create a BlobServiceClient
      const blobServiceClient = new BlobServiceClient(connectionString);

      // Get a container client
      const containerClient =
        blobServiceClient.getContainerClient(containerName);

      // Create a new blob in the container
      const blockBlobClient = containerClient.getBlockBlobClient(file.name);

      // Upload the file to the blob
      const uploadBlobResponse = await blockBlobClient.uploadBrowserData(file, {
        onProgress: (ev) => console.log(ev),
      });
      console.log(
        "Blob was uploaded successfully. requestId: ",
        uploadBlobResponse.requestId
      );

      // Get the URL of the uploaded file
      const url = await blockBlobClient.url;

      // Pass the URL to the callback function
      props.onUpload(url);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <input type="file" ref={fileInputRef} onChange={handleUpload} />
    </div>
  );
};

UploadFile.defaultProps = {
  onUpload: () => {},
};

export default UploadFile;
