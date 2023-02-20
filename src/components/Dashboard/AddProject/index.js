import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import { submitProject, editUser } from "../../../store/actions/UserActions";
import { sendFiles, editFiles } from "../../../store/actions/FileActions";
import { UploadFileToServer } from "../../../store/actions/ProofScopeActions";
import { uploadFileAzure } from "../../../store/actions/AzureFileActions";
import { formatAddProjectDate } from "../../../helper";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./index.scss";

function AddProject({
  showPopModal,
  isAdd,
  togglePopModal,
  selectedProject,
  selected,
  setSelected,
}) {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [count, setCount] = useState(0);
  const [printer, setArtworkPrinter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sosDate, setSOSDate] = useState("");
  const [uploadFile, setUploadFile] = useState("");
  const [owner, setOwner] = useState("");
  const [aprrovalStatus, setApprovalStatus] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [files, setFiles] = useState([]);
  const [initialFiles, setInitialFiles] = useState([]);
  const [isRequired, setIsRequired] = useState(true);
  // const connectionString = "Your connection string here";
  // const containerName = "your-container-name";
  const [recordId, setRecordId] = useState();

  useEffect(() => {
    if (!recordId) {
      setRecordId(Math.floor(Math.random() * 9000) + 1000);
    }
  }, [recordId]);

  useEffect(() => {
    setInitialFiles(files);
    if (files && files.length > 0) {
      setIsRequired(false);
    } else {
      setIsRequired(true);
    }
  }, [files, setInitialFiles, setIsRequired]);

  const projectName = (event) => {
    setName(event.target.value);
  };
  const projectCount = (event) => {
    setCount(event.target.value);
  };
  const projectPrinter = (event) => {
    setArtworkPrinter(event.target.value);
  };

  const projectStartDate = (event) => {
    const start = new Date(event.target.value);
    const dateString = start.toISOString().slice(0, 10);

    if (endDate === "" || start <= new Date(endDate)) {
      setStartDate(dateString);
    } else {
      alert("Start date should be less than or equal to end date");
    }
  };

  const projectEndDate = (event) => {
    const end = new Date(event.target.value);
    const dateString = end.toISOString().slice(0, 10);

    if (startDate !== "" && new Date(startDate) > end) {
      alert("End date should not be less than start date");
    } else if (sosDate !== "" && new Date(sosDate) < end) {
      alert("End date should not be greater than SOS date");
    } else {
      setEndDate(dateString);
    }
  };
  const projectSOSDate = (event) => {
    const sos = new Date(event.target.value);
    const dateString = sos.toISOString().slice(0, 10);

    if (endDate !== "" && new Date(endDate) > sos) {
      alert("SOS date should not be less than end date");
    } else {
      setSOSDate(dateString);
    }
  };
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const projectUploadFile = (event) => {
    const files = Array.from(event.target.files);

    const filteredFiles = files.filter((file) => file.size <= MAX_FILE_SIZE);
    if (filteredFiles.length < files.length) {
      alert(
        `Some files exceed the maximum size of 5 MB and will not be uploaded.`
      );
    }

    const mappedFiles = filteredFiles.map((file) => ({
      Name: file.name,
      size: file.size,
      timestamp: new Date().toISOString(),
    }));

    setFiles(mappedFiles);
  };

  const projectApprovedStatus = (event) => {
    setApprovalStatus(event.target.value);
  };
  const projectStatus = (event) => {
    setStatus(event.target.value);
  };
  const projectOwner = (event) => {
    setOwner(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const fileName = files[0].Name;
    const now = new Date();
    const date = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
    let hours = now.getHours();
    const amOrPm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const time = `${hours}:${minutes} ${amOrPm}`;
    const currentDateTime = `${date} ${time}`;
    const updateData = {
      Status: status,
      ProjectName: name,
      Approved: aprrovalStatus,
      Timestamp: currentDateTime,
      ProjectEndDate: endDate,
      ProjectStartDate: startDate,
      ArtworkCount: count,
      UpdateTime: currentDateTime,
      EstimatedSOS: sosDate,
      EstimatedAWPrinter: printer,
      RecordID: recordId,
      PM: owner,
    };

    const filePath = "cloudflow://PP_FILE_STORE/aacdata/" + fileName[0].Name;
    const filesInfo = {
      Filename: files[0].Name,
      RecordID: recordId?.toString(),
      Owner: owner,
      Size: files[0].size,
      Filepath: "",
      Timestamp: currentDateTime,
    };
    if (isAdd) {
      // await dispatch(UploadFileToServer(fileNamesAndPaths[0].name, filePath));
      dispatch(submitProject(updateData));
      // dispatch(uploadFileAzure(files));
      dispatch(
        sendFiles({
          Filename: files[0].Name,
          RecordID: recordId?.toString(),
          Owner: owner,
          Size: files[0].size,
          Filepath: "",
          Timestamp: currentDateTime,
        })
      );
    } else {
      setSelected([updateData]);
      // await dispatch(
      //   UploadFileToServer(fileNamesAndPaths[0], "C:/Users/ashacr/Downloads/")
      // );
      dispatch(editUser(updateData));
      dispatch(editFiles(filesInfo));
      // dispatch(uploadFileAzure(files));
    }
    //  const sortedProjects = projects.sort(
    //    (a, b) => b.timestamp - a.timestamp
    //  );
    //  setProjects(sortedProjects);
    togglePopModal(false);
    //  reset the values of input fields
    setName("");
    setCount(0);
    setStartDate("");
    setEndDate("");
    setSOSDate("");
    setOwner("");
    setUploadFile("");
    setFiles("");
    setApprovalStatus("");
    setStatus("");
    setArtworkPrinter("");
  };

  useEffect(() => {
    if (isAdd) {
      setName("");
      setCount(0);
      setStartDate("");
      setEndDate("");
      setSOSDate("");
      setOwner("");
      setUploadFile("");
      setFiles("");
      setApprovalStatus("");
      setSelected([]);
      setArtworkPrinter("");
      setIsRequired(true);
    } else {
      if (selectedProject) {
        setName(selectedProject.ProjectName);
        setCount(selectedProject.ArtworkCount);
        setStartDate(formatAddProjectDate(selectedProject?.ProjectStartDate));
        setEndDate(formatAddProjectDate(selectedProject?.ProjectEndDate));
        setSOSDate(formatAddProjectDate(selectedProject?.EstimatedSOS));
        setArtworkPrinter(
          formatAddProjectDate(selectedProject?.EstimatedAWPrinter)
        );
        setOwner(selectedProject.PM);
        setApprovalStatus(selectedProject.Approved);
        setStatus(selectedProject.Status);
        setRecordId(selectedProject.RecordID);
        if (selectedProject && selectedProject?.ArtworkFiles) {
          setFiles(selectedProject?.ArtworkFiles);
        }
        setIsRequired(false);
      }
    }
  }, [selectedProject, isAdd]);
  const handleRemoveFile = (fileIndex) => {
    const updatedFiles = [...files];
    updatedFiles.splice(fileIndex, 1);
    setFiles(updatedFiles);
  };
  const handleCancel = () => {
    setFiles(initialFiles);
    togglePopModal(false);
  };
  return (
    <div className="add-project">
      <Modal show={showPopModal} onHide={togglePopModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isAdd ? "Add a New Project" : "Edit your Project"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div className="error-message">{error}</div>}
          <Form onSubmit={handleSubmit}>
            <div className="group-fileds">
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Project Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={name || ""}
                  required
                  onChange={projectName}
                  placeholder="Enter Project Name"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formOwner">
                <Form.Label>Project Manager</Form.Label>
                <Form.Control
                  type="text"
                  value={owner || ""}
                  required
                  onChange={projectOwner}
                  placeholder="Enter PM Name"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formOwner">
                <Form.Label>Artwork Count</Form.Label>
                <Form.Control
                  type="number"
                  value={count || 0}
                  required
                  onChange={projectCount}
                  placeholder="Enter Count"
                />
              </Form.Group>
            </div>
            <div className="group-fileds">
              <Form.Group className="mb-3" controlId="formCount">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  value={startDate || ""}
                  onChange={projectStartDate}
                  type="date"
                  required
                  className="date-picker"
                  placeholder="Enter Start Date"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEndDate">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  value={endDate || ""}
                  onChange={projectEndDate}
                  type="date"
                  required
                  placeholder="Enter End Date"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formSosDate">
                <Form.Label>SOS Date</Form.Label>
                <Form.Control
                  type="date"
                  required
                  value={sosDate || ""}
                  onChange={projectSOSDate}
                  placeholder="Enter SOS Date"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formEndDate">
                <Form.Label>Approved</Form.Label>
                <Form.Select
                  value={aprrovalStatus || ""}
                  onChange={projectApprovedStatus}
                  type="text"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </Form.Select>
              </Form.Group>
            </div>
            <div className="group-fileds">
              <Form.Group
                className="mb-3 custom-file-upload"
                controlId="formUploadFile"
              >
                <Form.Label>Upload file</Form.Label>
                <div className="files-upload">
                  <input
                    type="file"
                    className="form-control-file"
                    id="file-input"
                    onChange={projectUploadFile}
                    // multiple
                    required={isRequired}
                  />
                  {files && files.length > 0 ? (
                    <div className="file-list">
                      {files?.map((file, index) => (
                        <div key={index} className="file-item">
                          <span>{file.Name}</span>
                          <span className="remove-file">
                            <span
                              onClick={() => handleRemoveFile(index)}
                              type="button"
                              className="btn-close"
                              aria-label="Close"
                            ></span>
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="file-list">
                        <div className="file-item">No files uploaded yet</div>
                      </div>
                      {isRequired && (
                        <span className="error-message">
                          Please upload file
                        </span>
                      )}
                    </>
                  )}
                  <label htmlFor="file-input" className="btn btn-primary">
                    Browse
                  </label>
                </div>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formEndDate">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={status || ""}
                  onChange={projectStatus}
                  type="text"
                  placeholder="Enter End Date"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="active">Active</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="onhold">onHold</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formCount">
                <Form.Label>AW@Printer</Form.Label>
                <Form.Control
                  value={printer || ""}
                  name="artworkPrinter"
                  onChange={projectPrinter}
                  type="date"
                  placeholder="Enter Printer date"
                />
              </Form.Group>
            </div>
            <div className="action-buttons">
              <Button variant="primary" type="submit">
                Submit
              </Button>
              <Button
                variant="primary cancel"
                type="reset"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AddProject;
