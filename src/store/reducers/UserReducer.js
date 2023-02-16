import { GET_USERS, USERS_ERROR } from "../types";
// import { BlobServiceClient } from "@azure/storage-blob";

const initialState = {
  users: [],
  loading: true,
  error: null,
  modalOpen: false,
};

const UserReducers = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "FORM_SUBMIT":
      return {
        ...state,
        loading: true,
      };
    case "FORM_SUBMIT_SUCCESS":
      return {
        ...state,
        users: [...state.users, payload],
        loading: false,
      };
    case "FORM_SUBMIT_ERROR":
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case "DELETE_ITEM_SUCCESS":
      return {
        ...state,
        users: state.users.filter((item) => item.id !== action.payload.id),
      };
    case "DELETE_ALL_ROWS":
      const deletedIds = action.payload;
      return {
        ...state,
        users: state.users.filter((user) => !deletedIds.includes(user.id)),
        //    users: action.payload,
      };

    case "DELETE_ALL_ERROR":
      return {
        ...state,
        error: payload,
      };
    case "DELETE_ITEM_ERROR":
      return {
        ...state,
        error: payload,
      };

    case "EDIT_USER":
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === payload.id ? payload : user
        ),
      };
    // case "UPLOAD_FILE":
    //   try {
    //     const blobServiceClient = new BlobServiceClient(
    //       payload.connectionString
    //     );
    //     const containerClient = blobServiceClient.getContainerClient(
    //       payload.containerName
    //     );
    //     const blockBlobClient = containerClient.getBlockBlobClient(
    //       payload.file.name
    //     );
    //     blockBlobClient.uploadBrowserData(
    //       action.payload.file,
    //       payload.file.size
    //     );
    //     return { ...state, url: blockBlobClient.url };
    //   } catch (error) {
    //     return { ...state, error: error.message };
    //   }
    // case "UPLOAD_FILE_ERROR":
    //   return { ...state, error: payload };

    case "GET_USERS_SUCCESS":
      return {
        ...state,
        users: action.payload,
        loading: false,
        error: null,
      };
    case "GET_USERS_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "GET_USERS_EMPTY":
      return {
        ...state,
        loading: false,
        error: action.payload,
        users: [],
      };
    case "OPEN_MODAL":
      return { ...state, modalOpen: true };
    case "CLOSE_MODAL":
      return { ...state, modalOpen: false };
    default:
      return state;
  }
};
export default UserReducers;
