import { takeEvery, fork, all, call, put } from "redux-saga/effects";

// Login Redux States
import LOCATION_CONST from "./locationConst";
import {
  locationError,
  locationSuccess,
  locationstateError,
  locationstateSuccess,
  locationsubError,
  locationsubSuccess,
} from "./locationActions";
import checkHttpStatus from "../apiUtils";
import { LOCATION_API, AXIOS_INSTANCE_LOADER } from "../apiUtils/config";
import baseMethod from "../../components/Common/baseMethod";

function* locationlist(action) {
  const url = `${LOCATION_API}/get-location`;
  try {
    const apiResponse = baseMethod(AXIOS_INSTANCE_LOADER.post(url, action.payload), "", "");

    const response = yield call(checkHttpStatus, apiResponse);
    if (response && response.status === 200) {
      const responseData = {
        statusCode: 200,
        data: response.data.result,
      };
      yield put(locationSuccess(responseData));
    } else {
      const responseData = {
        data: response.data.error,
      };
      yield put(locationError(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(locationError(errorData));
  }
}

function* locationstatelist(action) {
  const url = `${LOCATION_API}/get-location`;
  try {
    const apiResponse = baseMethod(AXIOS_INSTANCE_LOADER.post(url, action.payload), "", "");

    const response = yield call(checkHttpStatus, apiResponse);
    if (response && response.status === 200) {
      const responseData = {
        statusCode: 200,
        data: response.data.result,
      };
      yield put(locationstateSuccess(responseData));
    } else {
      const responseData = {
        data: response.data.error,
      };
      yield put(locationstateError(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(locationstateError(errorData));
  }
}
function* locationsublist(action) {
  const url = `${LOCATION_API}/get-location`;
  try {
    const apiResponse = baseMethod(AXIOS_INSTANCE_LOADER.post(url, action.payload), "", "");

    const response = yield call(checkHttpStatus, apiResponse);
    if (response && response.status === 200) {
      const responseData = {
        statusCode: 200,
        data: response.data.result,
      };
      yield put(locationsubSuccess(responseData));
    } else {
      const responseData = {
        data: response.data.error,
      };
      yield put(locationsubError(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(locationsubError(errorData));
  }
}

export function* watchLocation() {
  yield takeEvery(LOCATION_CONST.LOCATION_REQUEST, locationlist);
}
export function* watchLocationState() {
  yield takeEvery(LOCATION_CONST.LOCATION_STATE_REQUEST, locationstatelist);
}
export function* watchLocationSub() {
  yield takeEvery(LOCATION_CONST.LOCATION_SUB_REQUEST, locationsublist);
}

function* LocationSaga() {
  yield all([fork(watchLocation), fork(watchLocationState), fork(watchLocationSub)]);
}

export default LocationSaga;
