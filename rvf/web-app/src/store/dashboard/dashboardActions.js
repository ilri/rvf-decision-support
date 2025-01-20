import DASHBOARD_CONST from "./dashboardConst";

export const dashboardSourceRequest = (data) => {
  return {
    type: DASHBOARD_CONST.DASHBOARD_SOURCE_REQUEST,
    payload: data,
  };
};
export const dashboardSourceSuccess = (data) => {
  return {
    type: DASHBOARD_CONST.DASHBOARD_SOURCE_SUCCESS,
    payload: data,
  };
};
export const dashboardSourceError = (error) => {
  return {
    type: DASHBOARD_CONST.DASHBOARD_SOURCE_ERROR,
    payload: error,
  };
};

export const addMapRequest = (data) => {
  return {
    type: DASHBOARD_CONST.ADD_MAP_REQUEST,
    payload: { data },
  };
};
export const addMapSuccess = (data) => {
  return {
    type: DASHBOARD_CONST.ADD_MAP_SUCCESS,
    payload: data,
  };
};
export const addMapError = (error) => {
  return {
    type: DASHBOARD_CONST.ADD_MAP_ERROR,
    payload: error,
  };
};

export const addMap1Request = (data) => {
  return {
    type: DASHBOARD_CONST.ADD_MAP1_REQUEST,
    payload: { data },
  };
};
export const addMap1Success = (data) => {
  return {
    type: DASHBOARD_CONST.ADD_MAP1_SUCCESS,
    payload: data,
  };
};
export const addMap1Error = (error) => {
  return {
    type: DASHBOARD_CONST.ADD_MAP1_ERROR,
    payload: error,
  };
};

export const getTimeSeriesRequest = (data, indicatorurl) => ({
  type: DASHBOARD_CONST.GET_TIMESERIES_REQUEST,
  payload: {
    data,
    url: indicatorurl,
  },
});

export const getTimeSeriesSuccess = (response) => ({
  type: DASHBOARD_CONST.GET_TIMESERIES_SUCCESS,
  payload: response,
});

export const getTimeSeriesError = (error) => ({
  type: DASHBOARD_CONST.GET_TIMESERIES_ERROR,
  payload: error,
});

export const addRvfMapRequest = (data, indicatorurl) => {
  return {
    type: DASHBOARD_CONST.ADD_RVF_MAP_REQUEST,
    payload: { data, url: indicatorurl },
  };
};
export const addRvfMapSuccess = (user) => {
  return {
    type: DASHBOARD_CONST.ADD_RVF_MAP_SUCCESS,
    payload: user,
  };
};
export const addRvfMapError = (error) => {
  return {
    type: DASHBOARD_CONST.ADD_RVF_MAP_ERROR,
    payload: error,
  };
};

export const getRvfTimeSeriesRequest = (data, indicatorurl) => ({
  type: DASHBOARD_CONST.GET_RVF_TIMESERIES_REQUEST,
  payload: {
    data,
    url: indicatorurl,
  },
});

export const getRvfTimeSeriesSuccess = (response) => ({
  type: DASHBOARD_CONST.GET_RVF_TIMESERIES_SUCCESS,
  payload: response,
});

export const getRvfTimeSeriesError = (error) => ({
  type: DASHBOARD_CONST.GET_RVF_TIMESERIES_ERROR,
  payload: error,
});

export const getGfsNovaRequest = (data, indicatorurl) => ({
  type: DASHBOARD_CONST.GET_GFS_NOVA_REQUEST,
  payload: {
    data,
    url: indicatorurl,
  },
});

export const getGfsNovaSuccess = (response) => ({
  type: DASHBOARD_CONST.GET_GFS_NOVA_SUCCESS,
  payload: response,
});

export const getGfsNovaError = (error) => ({
  type: DASHBOARD_CONST.GET_GFS_NOVA_ERROR,
  payload: error,
});

export const modelingMapRequest = (data, indicatorurl) => {
  return {
    type: DASHBOARD_CONST.MODEL_MAP_REQUEST,
    payload: { data, url: indicatorurl },
  };
};
export const modelingMapSuccess = (user) => {
  return {
    type: DASHBOARD_CONST.MODEL_MAP_SUCCESS,
    payload: user,
  };
};
export const modelingMapError = (error) => {
  return {
    type: DASHBOARD_CONST.MODEL_MAP_ERROR,
    payload: error,
  };
};

export const gfsNoaaTemperatureRequest = (data, indicatorurl) => {
  return {
    type: DASHBOARD_CONST.GET_GFS_NOVA_TEMPERATURE_REQUEST,
    payload: { data, url: indicatorurl },
  };
};
export const gfsNoaaTemperatureSuccess = (user) => {
  return {
    type: DASHBOARD_CONST.GET_GFS_NOVA_TEMPERATURE_SUCCESS,
    payload: user,
  };
};
export const gfsNoaaTemperatureError = (error) => {
  return {
    type: DASHBOARD_CONST.GET_GFS_NOVA_TEMPERATURE_ERROR,
    payload: error,
  };
};
