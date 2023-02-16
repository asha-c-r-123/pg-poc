// Actions
export const UPLOAD_FILE_REQUEST = "UPLOAD_FILE_REQUEST";
export const UPLOAD_FILE_SUCCESS = "UPLOAD_FILE_SUCCESS";
export const UPLOAD_FILE_FAILURE = "UPLOAD_FILE_FAILURE";

// Reducer
const initialState = {
  loading: false,
  uploadedFile: null,
  error: null,
};

export const uploadFileReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPLOAD_FILE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPLOAD_FILE_SUCCESS:
      return {
        ...state,
        loading: false,
        uploadedFile: action.payload,
      };
    case UPLOAD_FILE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
