import axios from "axios";
const postURL =
  "https://pegadev.pg.com/prweb/api/AgilityApplication/v1/CreateFileMetaData";

const DeleteURL =
  "https://pegadev.pg.com/prweb/api/AgilityApplication/V1/DeletionofFileMetaData";

export const sendFiles = (formData) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(postURL, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      dispatch({
        type: "FILE_SUBMIT_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({ type: "File_SUBMIT_ERROR", payload: error });
    }
  };
};

export const editFiles = (formData) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(postURL, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      dispatch({
        type: "FILE_EDIT_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({ type: "File_EDIT_ERROR", payload: error });
    }
  };
};

export const deleteFiles = (formData) => {
  // console.log(formData);
  return async (dispatch) => {
    try {
      const response = await axios.post(DeleteURL, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      dispatch({
        type: "FILE_DELETE_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({ type: "File_DELETE_ERROR", payload: error });
    }
  };
};
