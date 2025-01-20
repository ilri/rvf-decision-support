import HOME_CONST from "./homeConst";

const initialState = {
  error: "",
  loading: false,
};

const Home = (state, action) => {
  if (typeof state === "undefined") {
    state = initialState;
  }
  switch (action.type) {
    case HOME_CONST.HOME_BANNER_REQUEST:
      state = {
        ...state,
        loading: true,
        homeBannerData: null,
        error: "",
      };
      break;
    case HOME_CONST.HOME_BANNER_SUCCESS:
      state = {
        ...state,
        loading: false,
        homeBannerData: action.payload.statusCode === 200 ? action.payload.data : false,
        error: "",
      };
      break;
    case HOME_CONST.HOME_BANNER_ERROR:
      state = {
        ...state,
        error: action.payload.data ? action.payload.data.errorDescription : "",
        loading: false,
        homeBannerData: null,
      };
      break;

    case HOME_CONST.HOME_GENERAL_TOOLS_REQUEST:
      state = {
        ...state,
        loading: true,
        homeGenralTools: null,
        error: "",
      };
      break;
    case HOME_CONST.HOME_GENERAL_TOOLS_SUCCESS:
      state = {
        ...state,
        loading: false,
        homeGenralTools: action.payload.statusCode === 200 ? action.payload.data : false,
        error: "",
      };
      break;
    case HOME_CONST.HOME_GENERAL_TOOLS_ERROR:
      state = {
        ...state,
        error: action.payload.data ? action.payload.data.errorDescription : "",
        loading: false,
        homeGenralTools: null,
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default Home;
