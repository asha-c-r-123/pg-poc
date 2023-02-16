import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { useDispatch } from "react-redux";
import { submitProject, editUser } from "../../../store/actions/UserActions";
import { UploadFileToServer } from "../../../store/actions/ProofScopeActions";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./index.scss";
import UploadFile from "../../FileUpload";

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
  const [count, setCount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sosDate, setSOSDate] = useState("");
  const [uploadFile, setUploadFile] = useState("");
  const [owner, setOwner] = useState("");
  const [aprrovalStatus, setApprovalStatus] = useState("");
  const [error, setError] = useState("");
  const [files, setFiles] = useState([]);
  const [initialFiles, setInitialFiles] = useState([]);
  const [isRequired, setIsRequired] = useState(true);
  // const connectionString = "Your connection string here";
  // const containerName = "your-container-name";
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);

  useEffect(() => {
    setInitialFiles(files);
    if (files && files.length > 0) {
      setIsRequired(false);
    } else {
      setIsRequired(true);
    }
  }, [files]);

  const projectName = (event) => {
    setName(event.target.value);
  };
  const projectCount = (event) => {
    setCount(event.target.value);
  };

  const projectStartDate = (event) => {
    const start = new Date(event.target.value);
    if (endDate !== "" && start > endDate) {
      alert("Start date should not be greater than end date");
    } else {
      setStartDate(start);
    }
  };

  const projectEndDate = (event) => {
    const end = new Date(event.target.value);
    if (startDate !== "" && end < startDate) {
      alert("End date should not be less than start date");
    } else {
      setEndDate(end);
    }
  };
  const projectSOSDate = (event) => {
    const sos = new Date(event.target.value);
    if (endDate !== "" && endDate > sos) {
      alert("End date should not be less than sos date");
    } else {
      setSOSDate(sos);
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
      name: file.name,
      // data: file,
      size: file.size,
      timestamp: new Date().toISOString(),
    }));

    setFiles(mappedFiles);
  };

  const projectStatus = (event) => {
    setApprovalStatus(event.target.value);
  };
  const projectOwner = (event) => {
    setOwner(event.target.value);
  };
  const handleUpload = (fileUrl) => {
    setUploadedFileUrl(fileUrl);
  };
  const validateStartEndDates = () => {
    if (startDate !== null && endDate !== null && startDate > endDate) {
      return "Start date should not be greater than end date";
    }
    return true;
  };
  const validateSosEndDates = () => {
    if (sosDate !== null && endDate !== null && endDate > sosDate) {
      return "End date should not be greater than sos date";
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationSE = validateStartEndDates();
    if (validationSE !== true) {
      alert(validationSE);
      return;
    }
    const validationES = validateSosEndDates();
    if (validationES !== true) {
      alert(validationES);
      return;
    }
    const fileName = files[0].name;
    console.log(fileName);
    const updateData = {
      name: name,
      count: count,
      startDate: startDate,
      endDate: endDate,
      sosDate: sosDate,
      // filename: files && files.length > 0 ? files : [],
      filename: files,
      status: aprrovalStatus,
      owener: owner,
      timestamp: Date.now(),
      tasks: [],
    };
    const filePath = "cloudflow://PP_FILE_STORE/aacdata/" + fileName[0].name;

    if (isAdd) {
      // await dispatch(UploadFileToServer(fileNamesAndPaths[0].name, filePath));
      dispatch(submitProject(updateData));
    } else {
      setSelected([updateData]);
      // await dispatch(
      //   UploadFileToServer(fileNamesAndPaths[0], "C:/Users/ashacr/Downloads/")
      // );
      dispatch(editUser(selectedProject.id, updateData));
    }
    //  const sortedProjects = projects.sort(
    //    (a, b) => b.timestamp - a.timestamp
    //  );
    //  setProjects(sortedProjects);
    togglePopModal(false);
    //  reset the values of input fields
    setName("");
    setCount("");
    setStartDate("");
    setEndDate("");
    setSOSDate("");
    setOwner("");
    setUploadFile("");
    setFiles("");
    setApprovalStatus("");
  };

  useEffect(() => {
    if (startDate !== null && endDate !== null && startDate > endDate) {
      setError("Start date should not be greater than end date");
    } else {
      setError("");
    }
    if (sosDate !== null && endDate !== null && endDate > sosDate) {
      setError("end date should not be greater than sos date");
    } else {
      setError("");
    }
  }, [startDate, endDate, sosDate]);

  useEffect(() => {
    if (isAdd) {
      setName("");
      setCount("");
      setStartDate("");
      setEndDate("");
      setSOSDate("");
      setOwner("");
      setUploadFile("");
      setFiles("");
      setApprovalStatus("");
      setSelected([]);
      setIsRequired(true);
    } else {
      setName(selectedProject.name);
      setCount(selectedProject.count);
      setStartDate(selectedProject.startDate);
      setEndDate(selectedProject.endDate);
      setSOSDate(selectedProject.sosDate);
      setOwner(selectedProject.owener);
      setApprovalStatus(selectedProject.status);
      setFiles(selectedProject.filename);
      setIsRequired(false);
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
                <Form.Label>Name</Form.Label>
                {/* <UploadFile connectionString={connectionString} containerName={containerName} onUpload={handleUpload} /> */}
                <Form.Control
                  type="text"
                  name="name"
                  value={name}
                  required
                  onChange={projectName}
                  placeholder="Enter Project Name"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formOwner">
                <Form.Label>Project Manager</Form.Label>
                <Form.Control
                  type="text"
                  value={owner}
                  required
                  onChange={projectOwner}
                  placeholder="Enter PM Name"
                />
              </Form.Group>
            </div>
            <div className="group-fileds">
              <Form.Group className="mb-3" controlId="formCount">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  value={
                    startDate !== null && !isNaN(new Date(startDate))
                      ? new Date(startDate).toISOString().slice(0, 10)
                      : ""
                  }
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
                  value={
                    endDate !== null && !isNaN(new Date(endDate))
                      ? new Date(endDate).toISOString().slice(0, 10)
                      : ""
                  }
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
                  value={
                    sosDate !== null && !isNaN(new Date(sosDate))
                      ? new Date(sosDate).toISOString().slice(0, 10)
                      : ""
                  }
                  onChange={projectSOSDate}
                  placeholder="Enter SOS Date"
                />
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
                      {Array.isArray(files) &&
                        files?.map((file, index) => (
                          <div key={index} className="file-item">
                            <span>{file.name}</span>
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
                  value={aprrovalStatus}
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
                  value={
                    count !== null && !isNaN(new Date(count))
                      ? new Date(count).toISOString().slice(0, 10)
                      : ""
                  }
                  name="count"
                  onChange={projectCount}
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
