// reducers/TaskReducer.js

import {
  ADD_TASK,
  DELETE_TASK,
  UPDATE_TASK,
  FETCH_TASKS,
} from "../actions/TaskActions";

const initialState = {
  tasks: [],
  isLoading: false,
  error: null,
};

export default function taskReducer(state = initialState, action) {
  switch (action.type) {
    case "FETCH_TASK_DETAILS":
      return {
        ...state,
        tasks: action.taskDetails,
        error: null,
      };
    case "FETCH_TASK_DETAILS_ERROR":
      return {
        ...state,
        tasks: [],
        error: action.error,
      };

    case "ADD_TASK_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case "ADD_TASK_SUCCESS":
      return {
        ...state,
        isLoading: false,
        error: null,
        tasks: action.payload,
      };
    case "ADD_TASK_ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case "UPDATE_TASK_START":
      return state;
    case "UPDATE_TASK_SUCCESS":
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task.id === action.payload.id) {
            return action.payload;
          } else {
            return task;
          }
        }),
        selectedProject: {
          ...state.selectedProject,
          tasks: state.tasks.map((task) => {
            if (task.id === action.payload.id) {
              return action.payload;
            } else {
              return task;
            }
          }),
        },
      };

    case "UPDATE_TASK_FAILURE":
      return { ...state, error: action.tasks, loading: false };
    case "DELETE_TASK_SUCCESS":
      return {
        ...state,
        isLoading: false,
        error: null,
        tasks: state.tasks.filter((task) => task.id !== action.payload.id),
      };
    case "DELETE_TASK_START":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "DELETE_TASK_SUCCESS":
      return {
        ...state,
        loading: false,
        projects: action.payload,
      };
    case "DELETE_TASK_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
