import { takeEvery, fork, all, call, put } from "redux-saga/effects";

// Login Redux States
import DASHBOARD_CONST from "./dashboardConst";
import {
  dashboardSourceError,
  dashboardSourceSuccess,
  addMapSuccess,
  addMapError,
  addMap1Success,
  addMap1Error,
  getTimeSeriesSuccess,
  getTimeSeriesError,
  addRvfMapSuccess,
  addRvfMapError,
  getRvfTimeSeriesSuccess,
  getRvfTimeSeriesError,
  getGfsNovaSuccess,
  getGfsNovaError,
  modelingMapSuccess,
  modelingMapError,
  gfsNoaaTemperatureError,
  gfsNoaaTemperatureSuccess,
} from "./dashboardActions";
import checkHttpStatus from "../apiUtils";
import { DASHBOARD_API, AXIOS_INSTANCE_LOADER, RainFall_API, Model_API } from "../apiUtils/config";
import baseMethod from "../../components/Common/baseMethod";

function* sourcelist() {
  const url = `${DASHBOARD_API}/rainfall_sources`;
  try {
    const apiResponse = baseMethod(AXIOS_INSTANCE_LOADER.get(url), "", "");

    const response = yield call(checkHttpStatus, apiResponse);
    if (response && response.status === 200) {
      const responseData = {
        statusCode: 200,
        data: response.data.result,
      };
      yield put(dashboardSourceSuccess(responseData));
    } else {
      const responseData = {
        data: response.data.error,
      };
      yield put(dashboardSourceError(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(dashboardSourceError(errorData));
  }
}

function* mapData(action) {
  try {
    const apiResponse = baseMethod(
      AXIOS_INSTANCE_LOADER.post(
        `${DASHBOARD_API}/${action.payload.data.api_url}/map`,
        action.payload.data
      ),
      "",
      ""
    );

    const response = yield call(checkHttpStatus, apiResponse);

    if (response && response.status === 200) {
      const responseData = {
        statusCode: 200,
        data: response.data.result,
        slug: action?.payload?.data?.slug,
      };
      yield put(addMapSuccess(responseData));
    } else {
      const responseData = {
        data: response.data.message,
      };
      yield put(addMapError(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(addMapError(errorData));
  }
}

function* mapData1(action) {
  try {
    const apiResponse = baseMethod(
      AXIOS_INSTANCE_LOADER.post(
        `${DASHBOARD_API}/${action.payload.data.api_url}/forecast/map`,
        action.payload.data
      ),
      "",
      ""
    );

    const response = yield call(checkHttpStatus, apiResponse);

    if (response && response.status === 200) {
      const responseData = {
        statusCode: 200,
        data: response.data.result,
        slug: action?.payload?.data?.slug,
      };
      yield put(addMap1Success(responseData));
    } else {
      const responseData = {
        data: response.data.message,
      };
      yield put(addMap1Error(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(addMap1Error(errorData));
  }
}

function* timeseries(action) {
  try {
    const apiResponse = baseMethod(
      AXIOS_INSTANCE_LOADER.post(
        `${DASHBOARD_API}/${action.payload.data.api_url}/timeseries`,
        action.payload.data
      ),
      "",
      ""
    );

    const response = yield call(checkHttpStatus, apiResponse);
    if (response && response.status === 200) {
      const responseData = {
        statusCode: 200,
        data: response.data.result,
      };
      yield put(getTimeSeriesSuccess(responseData));
    } else {
      const responseData = {
        data: response.data.message,
      };
      yield put(getTimeSeriesError(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(getTimeSeriesError(errorData));
  }
}

function* mapRvfData(action) {
  const countryId = action.payload.data.adm0_id;
  const countyId = action.payload.data.adm1_id;
  const subCountyId = action.payload.data.adm2_id;
  const currentDate = new Date(action.payload.data.start_date);
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  let apiUrl = `${DASHBOARD_API}/get_rvf_cases?country_id=${countryId}&year=${currentYear}&month=${currentMonth}&type=map`;
  if (countyId != null) {
    apiUrl += `&county_id=${countyId}`;
  }
  if (subCountyId != null) {
    apiUrl += `&sub_county_id=${subCountyId}`;
  }

  try {
    const apiResponse = baseMethod(AXIOS_INSTANCE_LOADER.get(apiUrl), "", "");

    const response = yield call(checkHttpStatus, apiResponse);

    if (response && response.status === 200) {
      const responseData = {
        statusCode: 200,
        data: response.data.result,
        slug: action?.payload?.data?.slug,
      };
      yield put(addRvfMapSuccess(responseData));
    } else {
      const responseData = {
        data: response.data.message,
      };
      yield put(addRvfMapError(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(addRvfMapError(errorData));
  }
}

function* timeseriesRvf(action) {
  const countryId = action.payload.data.adm0_id;
  const countyId = action.payload.data.adm1_id;
  const subCountyId = action.payload.data.adm2_id;
  const currentDate = new Date(action.payload.data.start_date);
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // Construct the base URL
  let apiUrl = `${DASHBOARD_API}/get_rvf_cases?country_id=${countryId}&year=${currentYear}&month=${currentMonth}&type=graph`;

  if (countyId != null) {
    apiUrl += `&county_id=${countyId}`;
  }
  // Check if subCountyId is available and not null/undefined
  if (subCountyId != null) {
    apiUrl += `&sub_county_id=${subCountyId}`;
  }
  try {
    const apiResponse = baseMethod(AXIOS_INSTANCE_LOADER.get(apiUrl), "", "");

    const response = yield call(checkHttpStatus, apiResponse);
    if (response && response.status === 200) {
      const responseData = {
        statusCode: 200,
        data: response.data.result,
      };
      yield put(getRvfTimeSeriesSuccess(responseData));
    } else {
      const responseData = {
        data: response.data.message,
      };
      yield put(getRvfTimeSeriesError(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(getRvfTimeSeriesError(errorData));
  }
}

function* timeseriesGfsNova(action) {
  try {
    const apiResponse = baseMethod(
      AXIOS_INSTANCE_LOADER.post(`${RainFall_API}/noaa/timeseries`, action.payload.data),
      "",
      ""
    );

    const response = yield call(checkHttpStatus, apiResponse);
    if (response && response.status === 200) {
      const responseData = {
        statusCode: 200,
        data: response.data.result,
      };
      yield put(getGfsNovaSuccess(responseData));
    } else {
      const responseData = {
        data: response.data.message,
      };
      yield put(getGfsNovaError(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(getGfsNovaError(errorData));
  }
}

function* modelMapData(action) {
  let apiUrl = `${Model_API}`;
  try {
    const apiResponse = baseMethod(AXIOS_INSTANCE_LOADER.post(apiUrl, action.payload.data));

    const response = yield call(checkHttpStatus, apiResponse);

    if (response && response.status === 200) {
      const responseData = {
        statusCode: 200,
        data: response.data.result,
        slug: action?.payload?.data?.slug,
      };
      yield put(modelingMapSuccess(responseData));
    } else {
      const responseData = {
        data: response.data.message,
      };
      yield put(modelingMapError(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(modelingMapError(errorData));
  }
}

function* gfsTemperatureData(action) {
  let apiUrl = `${RainFall_API}/noaa/timeseries`;
  try {
    const apiResponse = baseMethod(AXIOS_INSTANCE_LOADER.post(apiUrl, action.payload.data));

    const response = yield call(checkHttpStatus, apiResponse);

    if (response && response.status === 200) {
      const responseData = {
        statusCode: 200,
        data: response.data.result,
        slug: action?.payload?.data?.slug,
      };
      yield put(gfsNoaaTemperatureSuccess(responseData));
    } else {
      const responseData = {
        data: response.data.message,
      };
      yield put(gfsNoaaTemperatureError(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(gfsNoaaTemperatureError(errorData));
  }
}

export function* watchDashboard() {
  yield takeEvery(DASHBOARD_CONST.DASHBOARD_SOURCE_REQUEST, sourcelist);
}

export function* watchMapData() {
  yield takeEvery(DASHBOARD_CONST.ADD_MAP_REQUEST, mapData);
}

export function* watchMap1Data() {
  yield takeEvery(DASHBOARD_CONST.ADD_MAP1_REQUEST, mapData1);
}

export function* watchTimeSeries() {
  yield takeEvery(DASHBOARD_CONST.GET_TIMESERIES_REQUEST, timeseries);
}

export function* watchRvfMapData() {
  yield takeEvery(DASHBOARD_CONST.ADD_RVF_MAP_REQUEST, mapRvfData);
}

export function* watchRvfTimeSeries() {
  yield takeEvery(DASHBOARD_CONST.GET_RVF_TIMESERIES_REQUEST, timeseriesRvf);
}

export function* watchGfsNovaTimeSeries() {
  yield takeEvery(DASHBOARD_CONST.GET_GFS_NOVA_REQUEST, timeseriesGfsNova);
}

// gfsTemperatureData
export function* watchModelMapData() {
  yield takeEvery(DASHBOARD_CONST.MODEL_MAP_REQUEST, modelMapData);
}

export function* watchGfsTemperatureData() {
  yield takeEvery(DASHBOARD_CONST.GET_GFS_NOVA_TEMPERATURE_REQUEST, gfsTemperatureData);
}

function* DashboardSaga() {
  yield all([
    fork(watchDashboard),
    fork(watchMapData),
    fork(watchMap1Data),
    fork(watchTimeSeries),
    fork(watchRvfMapData),
    fork(watchRvfTimeSeries),
    fork(watchGfsNovaTimeSeries),
    fork(watchModelMapData),
    fork(watchGfsTemperatureData),
  ]);
}

export default DashboardSaga;
