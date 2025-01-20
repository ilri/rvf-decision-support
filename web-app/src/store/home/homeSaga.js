import { takeEvery, fork, all, call, put } from "redux-saga/effects";
// Login Redux States
import HOME_CONST from "./homeConst";
import {
  homeBannerSuccess,
  homeBannerError,
  homeGenralToolsSuccess,
  homeGenralToolsError,
} from "./homeActions";
import checkHttpStatus from "../apiUtils";
import { HOME_BANNER_API, AXIOS_INSTANCE_LOADER } from "../apiUtils/config";
import baseMethod from "../../components/Common/baseMethod";

function* homeBanner() {
  try {
    const apiResponse = baseMethod(
      AXIOS_INSTANCE_LOADER.get(`${HOME_BANNER_API}/general_banners`),
      "",
      ""
    );

    const response = yield call(checkHttpStatus, apiResponse);

    if (response && response.status === 200) {
      const responseData = {
        statusCode: 200,
        data: response.data.result,
      };

      yield put(homeBannerSuccess(responseData));
    } else {
      const responseData = {
        data: response.data.error,
      };
      yield put(homeBannerError(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(homeBannerError(errorData));
  }
}

function* homeGenralTools() {
  try {
    const apiResponse = baseMethod(
      AXIOS_INSTANCE_LOADER.get(`${HOME_BANNER_API}/general_tools`),
      "",
      ""
    );

    const response = yield call(checkHttpStatus, apiResponse);

    if (response && response.status === 200) {
      const responseData = {
        statusCode: 200,
        data: response.data.result,
      };

      yield put(homeGenralToolsSuccess(responseData));
    } else {
      const responseData = {
        data: response.data.error,
      };
      yield put(homeGenralToolsError(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(homeGenralToolsError(errorData));
  }
}

export function* watchHomeBanner() {
  yield takeEvery(HOME_CONST.HOME_BANNER_REQUEST, homeBanner);
}

export function* watchHomeGenralTools() {
  yield takeEvery(HOME_CONST.HOME_GENERAL_TOOLS_REQUEST, homeGenralTools);
}

function* HomeSaga() {
  yield all([fork(watchHomeBanner), fork(watchHomeGenralTools)]);
}

export default HomeSaga;
