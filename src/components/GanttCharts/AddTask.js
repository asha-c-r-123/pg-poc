import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { getTasks, deleteTask } from "../../store/actions/TaskActions";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
} from "react-bootstrap";

const AddTask = ({
  handleSubmitTask,
  isEditing,
  projectId,
  tasksInfo,
  setIsEditing,
  showForm,
  handleCancel,
}) => {
  const dispatch = useDispatch();
  const [newTask, setNewTask] = useState({
    name: "",
    start: new Date(),
    end: new Date(),
    progress: 0,
    id: "",
  });
  const formRef = useRef(null);
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  useEffect(() => {
    setModal(showForm);
  }, [showForm]);
  useEffect(() => {
    if (isEditing) {
      setNewTask(tasksInfo);
    }
  }, [tasksInfo, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "progress") {
      setNewTask({ ...newTask, [name]: Number(value) });
    } else if (isEditing) {
      if (name === "start" || name === "end") {
        const dateValue = Date.parse(value);
        if (isNaN(dateValue)) {
          // Set an error message or take other action if date is invalid
          return;
        }
        // console.log(newTask.start);

        if (name === "start" && Date.parse(newTask.end) < dateValue) {
          // Set an error message or take other action if start date is after end date
          alert("start date should be less than end date");
          return;
        }

        if (name === "end" && Date.parse(newTask.start) > dateValue) {
          // Set an error message or take other action if end date is before start date
          alert("end date should be greater than start date");
          return;
        }
      }

      const updatedTask = { ...newTask, [name]: value };
      setNewTask(updatedTask);
    } else {
      if (name === "start" || name === "end") {
        const dateValue = Date.parse(value);
        if (isNaN(dateValue)) {
          // Set an error message or take other action if date is invalid
          return;
        }

        if (name === "start" && Date.parse(newTask.end) < dateValue) {
          // Set an error message or take other action if start date is after end date
          alert("start date should be less than end date");
          return;
        }

        if (name === "end" && Date.parse(newTask.start) > dateValue) {
          // Set an error message or take other action if end date is before start date
          alert("end date should be greater than start date");
          return;
        }
      }

      setNewTask({ ...newTask, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSubmitTask(newTask);
    // formRef.current.reset();
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setModal(false);
    if (window.confirm("Are you sure you want to delete this task?")) {
      // dispatch(deleteTask(projectId, newTask.id));
      await dispatch(deleteTask(projectId, newTask.id));
      dispatch(getTasks(projectId));
    }
  };

  let start = newTask?.start || "";
  let end = newTask?.end || "";

  // check if start and end are valid dates
  if (new Date(start).toString() !== "Invalid Date") {
    start = new Date(start).toISOString().slice(0, 10);
  } else {
    start = "";
  }

  if (new Date(end).toString() !== "Invalid Date") {
    end = new Date(end).toISOString().slice(0, 10);
  } else {
    end = "";
  }

  return (
    <>
      <div className="add-project">
        <Modal show={modal} onHide={toggle} id="task-modal">
          <ModalHeader>
            <Modal.Title
              style={{
                color: "#0168bf",
                margin: "0 0 0 20px",
                fontWeight: "bold",
              }}
            >
              {isEditing ? "Edit Task" : "Add New Task"}
            </Modal.Title>
          </ModalHeader>
          <ModalBody>
            <Form ref={formRef}>
              <div className="group-fileds">
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="taskName">Task Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newTask?.name || ""}
                    name="name"
                    required
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="taskName">Task Owner Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newTask?.owner || ""}
                    name="owner"
                    required
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
              <div className="group-fileds">
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="startDate"> Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="start"
                    required
                    value={start}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="endDate">End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="end"
                    required
                    value={end}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
              <div className="group-fileds">
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="progress">Progress</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    value={newTask?.progress || 0}
                    name="progress"
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary cancel" onClick={handleCancel}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleSubmit}>
              {isEditing ? "Update" : "Submit"}
            </Button>
            {isEditing && (
              <Button
                onClick={handleDelete}
                variant="danger"
                style={{ backgroundColor: "#dc3545", border: "#dc3545" }}
              >
                Delete
              </Button>
            )}
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
};

export default AddTask;
