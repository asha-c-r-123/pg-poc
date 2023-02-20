import { GET_USERS, USERS_ERROR } from "../types";
import axios from "axios";

//get all project data
const baseURL =
  "https://pegadev.pg.com/prweb/api/AgilityApplication/v1/GetArtworkAgilityDetails";

const postURL =
  "https://pegadev.pg.com/prweb/api/AgilityApplication/v1/CreateProjectDetails";
const DeleteURL =
  "https://pegadev.pg.com/prweb/api/AgilityApplication/v1/DeleteProjectDetails";

export const getUsers = () => async (dispatch) => {
  try {
    const res = await axios.get(baseURL);
    if (res.data.length === 0) {
      dispatch({ type: "GET_USERS_EMPTY", payload: "No records found" });
    } else {
      dispatch({
        type: "GET_USERS_SUCCESS",
        payload: res.data?.ArtworkAgilityProjects,
      });
    }
  } catch (err) {
    console.error(err);
    dispatch({ type: "GET_USERS_ERROR", payload: err });
  }
};

export const submitProject = (formData) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(postURL, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      dispatch({
        type: "FORM_SUBMIT_SUCCESS",
        payload: response.data,
      });
      dispatch(getUsers());
    } catch (error) {
      console.log(error);
      dispatch({ type: "FORM_SUBMIT_ERROR", payload: error });
    }
  };
};

export const editUser = (updatedData) => async (dispatch) => {
  try {
    const response = await axios.post(postURL, updatedData);
    dispatch({
      type: "EDIT_USER",
      payload: response.data,
    });
    dispatch(getUsers());
  } catch (err) {
    dispatch({
      type: "EDIT_USER_ERROR",
      payload: err.response.data,
    });
  }
};
export const deleteRow = (data) => async (dispatch) => {
  try {
    const res = await axios.post(DeleteURL, data);
    dispatch({ type: "DELETE_ITEM_SUCCESS", payload: res.data });
  } catch (err) {
    dispatch({ type: "DELETE_ITEM_ERROR", payload: err });
  }
};
// export const deleteAllRows = (ids) => {
//   return async (dispatch) => {
//     try {
//       // Delete all rows with ids
//       const promises = ids.map(async (id) => {
//         await axios.delete(`http://localhost:3001/data/${id}`);
//       });
//       await Promise.all(promises).then(() => {
//         // all deletions have completed
//         dispatch({
//           type: "DELETE_ALL_ROWS",
//           payload: ids,
//         });
//         if (!ids.length) {
//           // update the error state to show "No records found" in the table
//           dispatch({ type: "GET_USERS_EMPTY", payload: "No records found" });
//         }
//       });
//     } catch (error) {
//       console.error(error);
//     }
//   };
// };
// // export const deleteAllRows = (ids) => {
// //   return async (dispatch) => {
// //     try {
// //       ids.map(async (id) => {
// //         await axios.delete(`http://localhost:3001/data/${id}`);
// //       });
// //       dispatch({
// //         type: "DELETE_ALL_ROWS",
// //         payload: ids,
// //       });
// //     } catch (error) {
// //       console.error(error);
// //     }
// //   };
// // };

export const openModal = () => {
  return { type: "OPEN_MODAL" };
};

export const closeModal = () => {
  return { type: "CLOSE_MODAL" };
};

export const uploadFile = (payload) => {
  return {
    type: "UPLOAD_FILE",
    payload: payload,
  };
};
export const uploadFileError = (error) => {
  return {
    type: "UPLOAD_FILE_ERROR",
    payload: error,
  };
};
