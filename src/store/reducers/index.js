import { combineReducers } from "redux";
import tasksReducer from "./TaskReducer";
import userReducer from "./UserReducer";
import ganttReducer from "./GanttReducer";
import fileReducer from "./FileReducer";
import azureFileUpload from "./AzureFileReducer";
export default combineReducers({
  users: userReducer,
  tasks: tasksReducer,
  projectDetails: ganttReducer,
  files: fileReducer,
  uploadUrl: azureFileUpload,
});
