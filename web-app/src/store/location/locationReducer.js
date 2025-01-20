import LOCATION_CONST from "./locationConst";

const initialState = {
  error: "",
  loading: false,
};
const Location = (state, action) => {
  if (typeof state === "undefined") {
    state = initialState;
  }
  switch (action.type) {
    case LOCATION_CONST.LOCATION_REQUEST:
      state = {
        ...state,
        loading: true,
        LocationList: null,
        error: "",
      };
      break;
    case LOCATION_CONST.LOCATION_SUCCESS:
      state = {
        ...state,
        loading: false,
        LocationList: action.payload.statusCode === 200 ? action.payload.data : false,
        error: "",
      };
      break;
    case LOCATION_CONST.LOCATION_ERROR:
      state = {
        ...state,
        error: action.payload.data ? action.payload.data.errorDescription : "",
        loading: false,
        LocationList: null,
      };
      break;

    case LOCATION_CONST.LOCATION_STATE_REQUEST:
      state = {
        ...state,
        loading: true,
        LocationstateList: null,
        error: "",
      };
      break;
    case LOCATION_CONST.LOCATION_STATE_SUCCESS:
      state = {
        ...state,
        loading: false,
        LocationstateList: action.payload.statusCode === 200 ? action.payload : false,
        error: "",
      };
      break;
    case LOCATION_CONST.LOCATION_STATE_ERROR:
      state = {
        ...state,
        error: action.payload.data ? action.payload.data.errorDescription : "",
        loading: false,
        LocationstateList: null,
      };
      break;

    case LOCATION_CONST.LOCATION_SUB_REQUEST:
      state = {
        ...state,
        loading: true,
        LocationsubList: null,
        error: "",
      };
      break;
    case LOCATION_CONST.LOCATION_SUB_SUCCESS:
      state = {
        ...state,
        loading: false,
        LocationsubList: action.payload.statusCode === 200 ? action.payload : false,
        error: "",
      };
      break;
    case LOCATION_CONST.LOCATION_SUB_ERROR:
      state = {
        ...state,
        error: action.payload.data ? action.payload.data.errorDescription : "",
        loading: false,
        LocationsubList: null,
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};
export default Location;
