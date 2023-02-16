import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function DeleteModal({
  handleModalDelete,
  showDeleteModal,
  setShowDeleteModal,
  deleteMessage,
}) {
  const handleDelete = () => {
    handleModalDelete();
    setShowDeleteModal(false);
  };

  return (
    <Modal
      show={showDeleteModal}
      onHide={() => setShowDeleteModal(false)}
      id="delete-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Delete Project</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>Are you sure you want to {deleteMessage} ?</p>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary cancel"
          onClick={() => setShowDeleteModal(false)}
        >
          Cancel
        </Button>
        <Button variant="primary" onClick={handleDelete}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default DeleteModal;
