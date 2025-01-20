import DASHBOARD_CONST from "./dashboardConst";

const initialState = {
  error: "",
  loading: false,
};
const Dashboard = (state, action) => {
  if (typeof state === "undefined") {
    state = initialState;
  }
  switch (action.type) {
    case DASHBOARD_CONST.DASHBOARD_SOURCE_REQUEST:
      state = {
        ...state,
        loading: true,
        SourceList: null,
        error: "",
      };
      break;
    case DASHBOARD_CONST.DASHBOARD_SOURCE_SUCCESS:
      state = {
        ...state,
        loading: false,
        SourceList: action?.payload?.statusCode === 200 ? action.payload.data : false,
        error: "",
      };
      break;
    case DASHBOARD_CONST.DASHBOARD_SOURCE_ERROR:
      state = {
        ...state,
        error: action?.payload?.data ? action?.payload?.data?.errorDescription : "",
        loading: false,
        SourceList: null,
      };
      break;
    case DASHBOARD_CONST.ADD_MAP_REQUEST:
      state = {
        ...state,
        mapRainLoading: true,
        mapData: null,
        error: "",
        mapDataError: "",
        dashboardSlug: "",
      };
      break;
    case DASHBOARD_CONST.ADD_MAP_SUCCESS:
      state = {
        ...state,
        mapRainLoading: false,
        mapData: action?.payload?.statusCode === 200 ? action?.payload?.data : false,
        dashboardSlug: action?.payload?.statusCode === 200 ? action?.payload?.slug : false,
        error: "",
        mapDataError: "",
      };
      break;
    case DASHBOARD_CONST.ADD_MAP_ERROR:
      state = {
        ...state,
        error: action?.payload?.data ? action?.payload?.data : "",
        mapRainLoading: false,
        mapData: null,
        mapDataError: action?.payload?.data ? action?.payload?.data : "",
        dashboardSlug: "",
      };
      break;
    case DASHBOARD_CONST.ADD_MAP1_REQUEST:
      state = {
        ...state,
        mapRain1Loading: true,
        mapData1: null,
        error: "",
        mapDataError: "",
        dashboardSlug: "",
      };
      break;
    case DASHBOARD_CONST.ADD_MAP1_SUCCESS:
      state = {
        ...state,
        mapRain1Loading: false,
        mapData1: action?.payload?.statusCode === 200 ? action?.payload?.data : false,
        dashboardSlug: action?.payload?.statusCode === 200 ? action?.payload?.slug : false,
        error: "",
        mapDataError: "",
      };
      break;
    case DASHBOARD_CONST.ADD_MAP1_ERROR:
      state = {
        ...state,
        error: action?.payload?.data ? action?.payload?.data : "",
        mapRain1Loading: false,
        mapData1: null,
        mapDataError: action?.payload?.data ? action?.payload?.data : "",
        dashboardSlug: "",
      };
      break;
    case DASHBOARD_CONST.GET_TIMESERIES_REQUEST:
      state = {
        ...state,
        timeSeriesloading: true,
        timeseriesData: null,
        error: "",
      };
      break;
    case DASHBOARD_CONST.GET_TIMESERIES_SUCCESS:
      state = {
        ...state,
        timeSeriesloading: false,
        timeseriesData: action?.payload?.statusCode === 200 ? action?.payload?.data : false,
        error: "",
      };
      break;
    case DASHBOARD_CONST.GET_TIMESERIES_ERROR:
      state = {
        ...state,
        error: action?.payload?.data,
        timeSeriesloading: false,
        timeseriesData: null,
      };
      break;
    case DASHBOARD_CONST.ADD_RVF_MAP_REQUEST:
      state = {
        ...state,
        mapLoading: true,
        mapDataRvf: null,
        error: "",
        mapDataError: "",
        dashboardSlug: "",
      };
      break;
    case DASHBOARD_CONST.ADD_RVF_MAP_SUCCESS:
      state = {
        ...state,
        mapLoading: false,
        mapDataRvf: action?.payload?.statusCode === 200 ? action?.payload?.data : false,
        dashboardSlug: action?.payload?.statusCode === 200 ? action?.payload?.slug : false,
        error: "",
        mapDataError: "",
      };
      break;
    case DASHBOARD_CONST.ADD_RVF_MAP_ERROR:
      state = {
        ...state,
        error: action?.payload?.data ? action?.payload?.data : "",
        mapLoading: false,
        mapDataRvf: null,
        mapDataError: action?.payload?.data ? action?.payload?.data : "",
        dashboardSlug: "",
      };
      break;
    case DASHBOARD_CONST.GET_RVF_TIMESERIES_REQUEST:
      state = {
        ...state,
        timeSeriesRvfloading: true,
        timeseriesDataRvf: null,
        error: "",
      };
      break;
    case DASHBOARD_CONST.GET_RVF_TIMESERIES_SUCCESS:
      state = {
        ...state,
        timeSeriesRvfloading: false,
        timeseriesDataRvf: action?.payload?.statusCode === 200 ? action?.payload?.data : false,
        error: "",
      };
      break;
    case DASHBOARD_CONST.GET_RVF_TIMESERIES_ERROR:
      state = {
        ...state,
        error: action?.payload?.data,
        timeSeriesRvfloading: false,
        timeseriesDataRvf: null,
      };
      break;
    case DASHBOARD_CONST.GET_GFS_NOVA_REQUEST:
      state = {
        ...state,
        timeSeriesGfsNovaloading: true,
        timeseriesGfsNova: null,
        error: "",
      };
      break;
    case DASHBOARD_CONST.GET_GFS_NOVA_SUCCESS:
      state = {
        ...state,
        timeSeriesGfsNovaloading: false,
        timeseriesGfsNova: action?.payload?.statusCode === 200 ? action?.payload?.data : false,
        error: "",
      };
      break;
    case DASHBOARD_CONST.GET_GFS_NOVA_ERROR:
      state = {
        ...state,
        error: action?.payload?.data,
        timeSeriesGfsNovaloading: false,
        timeseriesGfsNova: null,
      };
      break;
    case DASHBOARD_CONST.MODEL_MAP_REQUEST:
      state = {
        ...state,
        mapRainLoading: true,
        forcastMapData: null,
        error: "",
        forcastMapDataError: "",
        dashboardSlug: "",
      };
      break;
    case DASHBOARD_CONST.MODEL_MAP_SUCCESS:
      state = {
        ...state,
        mapRainLoading: false,
        forcastMapData: action?.payload?.statusCode === 200 ? action?.payload?.data : false,
        dashboardSlug: action?.payload?.statusCode === 200 ? action?.payload?.slug : false,
        error: "",
        forcastMapDataError: "",
      };
      break;
    case DASHBOARD_CONST.MODEL_MAP_ERROR:
      state = {
        ...state,
        error: action?.payload?.data ? action?.payload?.data : "",
        mapRainLoading: false,
        forcastMapData: null,
        forcastMapDataError: action?.payload?.data ? action?.payload?.data : "",
        dashboardSlug: "",
      };
      break;

    case DASHBOARD_CONST.GET_GFS_NOVA_TEMPERATURE_REQUEST:
      state = {
        ...state,
        gfsTemperatureLoading: true,
        error: "",
        temperatureData: "",
        gfsTemperatureError: "",
      };
      break;
    case DASHBOARD_CONST.GET_GFS_NOVA_TEMPERATURE_SUCCESS:
      state = {
        ...state,
        gfsTemperatureLoading: false,
        error: "",
        temperatureData: action?.payload?.statusCode === 200 ? action?.payload?.data : false,
        gfsTemperatureError: "",
      };
      break;
    case DASHBOARD_CONST.GET_GFS_NOVA_TEMPERATURE_ERROR:
      state = {
        ...state,
        gfsTemperatureLoading: true,
        error: action?.payload?.data ? action?.payload?.data : "",
        temperatureData: null,
        gfsTemperatureError: action?.payload?.data ? action?.payload?.data : "",
      };
      break;

    default:
      state = { ...state };
      break;
  }
  return state;
};
export default Dashboard;
