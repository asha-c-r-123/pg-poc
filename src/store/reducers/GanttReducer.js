const initialState = {
  projectDetails: {},
  loading: false,
  error: null,
};

const ganttReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_PROJECT_DETAILS_SUCCESS":
      return {
        ...state,
        projectDetails: action.payload,
        loading: false,
      };
    case "GET_PROJECT_DETAILS_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case "GET_PROJECT_DETAILS_LOADING":
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
};
export default ganttReducer;
