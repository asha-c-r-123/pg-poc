import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form } from "react-bootstrap";

function FilterModal({
  showFilter,
  setShowFilter,
  handleFilterStatus,
  selectedStatus,
}) {
  const [status, setStatus] = useState(selectedStatus);
  const projectStatus = (e) => {
    setStatus(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    handleFilterStatus(status);
  };
  return (
    <Modal
      show={showFilter}
      onHide={() => setShowFilter(false)}
      id="delete-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Filter Project</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formEndDate">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={status}
              onChange={projectStatus}
              type="text"
              required
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="cancelled">Cancelled</option>
              <option value="onhold">onHold</option>
              <option value="all">All</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary cancel"
            onClick={() => setShowFilter(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Yes
          </Button>
        </Modal.Footer>{" "}
      </Form>
    </Modal>
  );
}
export default FilterModal;
