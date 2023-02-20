const initialState = {
  uploadedUrl: null,
  isLoading: false,
  error: null,
};

function azureFileUpload(state = initialState, action) {
  switch (action.type) {
    case "UPLOAD_FILE_PENDING":
      return { ...state, isLoading: true };
    case "UPLOAD_FILE_SUCCESS":
      return { ...state, uploadedUrl: action.payload, isLoading: false };
    case "UPLOAD_FILE_ERROR":
      return { ...state, error: action.error, isLoading: false };
    default:
      return state;
  }
}
