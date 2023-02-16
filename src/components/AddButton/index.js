import React from "react";
import Button from "react-bootstrap/Button";
import AddIconImg from "../../images/plus.svg";
function AddButton({ handleAdd }) {
  const addProject = () => {
    handleAdd();
  };
  return (
    <div>
      <Button onClick={addProject} id="add-project">
        <img src={AddIconImg} alt="Add" /> Add New Project
      </Button>
    </div>
  );
}
export default AddButton;
