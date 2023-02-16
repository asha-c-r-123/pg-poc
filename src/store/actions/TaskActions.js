import axios from "axios";
export const ADD_TASK = "ADD_TASK";
export const DELETE_TASK = "DELETE_TASK";
export const UPDATE_TASK = "UPDATE_TASK";
export const FETCH_TASKS = "FETCH_TASKS";

const baseURL =
  "https://pegadev.pg.com/prweb/api/AgilityApplication/v1/GetArtworkAgilityDetails";
const url = "";
export function addTask(task, projId) {
  return async (dispatch) => {
    dispatch({ type: "ADD_TASK_START" });
    try {
      const res = await axios.get(
        `https://pegadev.pg.com/prweb/api/AgilityApplication/v1/GetArtworkAgilityDetails/${projId}`
      );
      const project = res.data;
      project.tasks.push(task);
      await axios.put(
        `https://pegadev.pg.com/prweb/api/AgilityApplication/v1/GetArtworkAgilityDetails/${projId}`,
        project
      );
      dispatch({ type: "ADD_TASK_SUCCESS", payload: project.tasks });
      dispatch(getTasks());
    } catch (error) {
      dispatch({ type: "ADD_TASK_ERROR", payload: error });
    }
  };
}

export const updateTask = (task, projId) => {
  return async (dispatch) => {
    dispatch({ type: "UPDATE_TASK_START" });
    try {
      const res = await axios.get(`http://localhost:3001/data/${projId}`);
      const project = res.data;

      const taskIndex = project.tasks.findIndex((t) => t.id === task.id);
      project.tasks[taskIndex] = task;
      await axios.put(`http://localhost:3001/data/${projId}`, project);
      dispatch({ type: "UPDATE_TASK_SUCCESS", payload: project });
    } catch (error) {
      dispatch({ type: "UPDATE_TASK_ERROR", payload: error });
    }
  };
};

// export function getTasks(projectId) {
//   return async (dispatch) => {
//     try {
//       const cachedData = JSON.parse(
//         sessionStorage.getItem("http://localhost:3001/data/")
//       );
//       const selectedProject = cachedData?.find(
//         (item) => item.id.toString() === projectId?.toString()
//       );
//       const tasks = selectedProject?.tasks || [];
//       dispatch({
//         type: "FETCH_TASKS",
//         tasks,
//       });
//     } catch (error) {
//       console.error(error);
//       dispatch({
//         type: "FETCH_TASKS_ERROR",
//         error,
//       });
//     }
//   };
// }

export function getTasks(projectId) {
  return async (dispatch) => {
    try {
      const data = await axios.get(
        "https://pegadev.pg.com/prweb/api/AgilityApplication/v1/GetArtworkAgilityDetails"
      );
      let selectedProject =
        data &&
        data.find(
          (item) =>
            item.RecordID.toString() === (projectId && projectId.toString())
        );
      let tasks =
        selectedProject && selectedProject.TaskDetails
          ? selectedProject.TaskDetails
          : [];
      dispatch({
        type: "FETCH_TASKS",
        tasks: tasks,
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: "FETCH_TASKS_ERROR",
        error: error,
      });
    }
  };
}

export function deleteTask(projId, taskId) {
  console.log(projId, taskId);
  return async (dispatch) => {
    dispatch({ type: "DELETE_TASK_START" });
    try {
      const res = await axios.get(`http://localhost:3001/data/${projId}`);
      const project = res.data;
      project.tasks = project.tasks.filter((task) => task.id !== taskId);
      await axios.put(`http://localhost:3001/data/${projId}`, project);
      dispatch({ type: "DELETE_TASK_SUCCESS", payload: project });
      dispatch(getTasks());
    } catch (error) {
      dispatch({ type: "DELETE_TASK_ERROR", payload: error });
    }
  };
}

export function deleteAllTasks(projId) {
  return async (dispatch) => {
    dispatch({ type: "DELETE_ALL_TASKS_START" });
    try {
      const res = await axios.get(`http://localhost:3001/data/${projId}`);
      const project = res.data;
      project.tasks = [];
      await axios.put(`http://localhost:3001/data/${projId}`, project);
      dispatch({ type: "DELETE_ALL_TASKS_SUCCESS", payload: project });
      dispatch(getTasks());
    } catch (error) {
      dispatch({ type: "DELETE_ALL_TASKS_ERROR", payload: error });
    }
  };
}
