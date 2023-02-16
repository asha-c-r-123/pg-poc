import axios from "axios";

export const getProjectDetails = (projectId) => async (dispatch) => {
  try {
    const res = await axios.get(
      `https://pegadev.pg.com/prweb/api/AgilityApplication/v1/GetArtworkAgilityDetails/${projectId}`
    );
    if (res.data?.ArtworkAgilityProjects === null) {
      dispatch({
        type: "GET_PROJECT_DETAILS_ERROR",
        payload: "No records found",
      });
    } else {
      dispatch({
        type: "GET_PROJECT_DETAILS_SUCCESS",
        payload: res.data?.ArtworkAgilityProjects,
      });
    }
  } catch (err) {
    console.error(err);
    dispatch({ type: "GET_PROJECT_DETAILS_ERROR", payload: err });
  }
};

// export const getProjectDetails = (projectId) => async (dispatch) => {
//   console.log(projectId);
//   try {
//     const res = await axios.get(`http://localhost:3001/data/${projectId}`);
//     if (res.data === null) {
//       dispatch({
//         type: "GET_PROJECT_DETAILS_ERROR",
//         payload: "No records found",
//       });
//     } else {
//       dispatch({ type: "GET_PROJECT_DETAILS_SUCCESS", payload: res.data });
//     }
//   } catch (err) {
//     console.error(err);
//     dispatch({ type: "GET_PROJECT_DETAILS_ERROR", payload: err });
//   }
// };
