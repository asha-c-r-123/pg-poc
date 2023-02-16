import { combineReducers } from "redux";
import tasksReducer from "./TaskReducer";
import userReducer from "./UserReducer";
import ganttReducer from "./GanttReducer";

export default combineReducers({
  users: userReducer,
  projecttasks: tasksReducer,
  projectDetails: ganttReducer,
});
