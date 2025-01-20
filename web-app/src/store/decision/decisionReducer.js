import DESICION_CONST from "./decisionConst";

const initialState = {
  error: "",
  loading: false,
};
const Desicion = (state, action) => {
  if (typeof state === "undefined") {
    state = initialState;
  }
  switch (action.type) {
    case DESICION_CONST.DESICION_EPIDEMIC_REQUEST:
      state = {
        ...state,
        epidemicLoading: true,
        EpidemicList: null,
        error: "",
      };
      break;
    case DESICION_CONST.DESICION_EPIDEMIC_SUCCESS:
      state = {
        ...state,
        epidemicLoading: false,
        EpidemicList: action?.payload?.statusCode === 200 ? action.payload.data : false,
        error: "",
      };
      break;
    case DESICION_CONST.DESICION_EPIDEMIC_ERROR:
      state = {
        ...state,
        error: action?.payload?.data ? action?.payload?.data?.errorDescription : "",
        epidemicLoading: false,
        EpidemicList: null,
      };
      break;
    case DESICION_CONST.DESICION_CATEGORY_REQUEST:
      state = {
        ...state,
        categoryLoading: true,
        CategoryList: null,
        error: "",
      };
      break;
    case DESICION_CONST.DESICION_CATEGORY_SUCCESS:
      state = {
        ...state,
        categoryLoading: false,
        CategoryList: action?.payload?.statusCode === 200 ? action.payload.data : false,
        error: "",
      };
      break;
    case DESICION_CONST.DESICION_CATEGORY_ERROR:
      state = {
        ...state,
        error: action?.payload?.data ? action?.payload?.data?.errorDescription : "",
        categoryLoading: false,
        CategoryList: null,
      };
      break;
    case DESICION_CONST.DESICION_INTERVENTIONS_REQUEST:
      state = {
        ...state,
        interventionLoading: true,
        interventionData: null,
        error: "",
      };
      break;
    case DESICION_CONST.DESICION_INTERVENTIONS_SUCCESS:
      state = {
        ...state,
        interventionLoading: false,
        interventionData: action?.payload?.statusCode === 200 ? action.payload.data : false,
        error: "",
      };
      break;
    case DESICION_CONST.DESICION_INTERVENTIONS_ERROR:
      state = {
        ...state,
        error: action?.payload?.data ? action?.payload?.data?.errorDescription : "",
        interventionLoading: false,
        interventionData: null,
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};
export default Desicion;
