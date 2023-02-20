const initialState = {
  files: {},
  loading: false,
  error: null,
};

const fileReducer = (state = initialState, action) => {
  console.log(action.payload);
  switch (action.type) {
    case "FILE_SUBMIT_SUCCESS":
      return {
        ...state,
        files: action.payload,
        loading: false,
      };
    case "File_SUBMIT_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case "FILE_EDIT_SUCCESS":
      return {
        ...state,
        files: action.payload,
        loading: false,
      };
    case "File_EDIT_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case "FILE_DELETE_SUCCESS":
      return {
        ...state,
        files: action.payload,
      };
    case "File_DELETE_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};
export default fileReducer;
