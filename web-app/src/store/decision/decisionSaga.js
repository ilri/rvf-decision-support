import { takeEvery, fork, all, call, put } from "redux-saga/effects";

// Login Redux States
import DESICION_CONST from "./decisionConst";
import {
  desicionEpidemicError,
  desicionEpidemicSuccess,
  desicionCategorySuccess,
  desicionCategoryError,
  desicionInterventionsSuccess,
  desicionInterventionsError,
} from "./decisionActions";
import checkHttpStatus from "../apiUtils";
import { DESICION_API, AXIOS_INSTANCE_LOADER } from "../apiUtils/config";
import baseMethod from "../../components/Common/baseMethod";

function* epidemiclist() {
  const url = `${DESICION_API}/epidemic_phase_list`;
  try {
    const apiResponse = baseMethod(AXIOS_INSTANCE_LOADER.get(url), "", "");

    const response = yield call(checkHttpStatus, apiResponse);
    if (response && response.status === 200) {
      const responseData = {
        statusCode: 200,
        data: response.data.result,
      };
      yield put(desicionEpidemicSuccess(responseData));
    } else {
      const responseData = {
        data: response.data.error,
      };
      yield put(desicionEpidemicError(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(desicionEpidemicError(errorData));
  }
}
function* categorylist(action) {
  const phaseId = action?.payload?.phase;
  const eventId = action?.payload?.event;
  const subEventId = action?.payload?.subEvent;
  let url = `${DESICION_API}/category_list?epidemic_phase_id=${phaseId}`;

  if (eventId !== null) {
    url += `&event_id=${eventId}`;
  }
  if (subEventId !== null) {
    url += `&sub_event_id=${subEventId}`;
  }
  try {
    const apiResponse = baseMethod(AXIOS_INSTANCE_LOADER.get(url), "", "");

    const response = yield call(checkHttpStatus, apiResponse);
    if (response && response.status === 200) {
      const responseData = {
        statusCode: 200,
        data: response.data.result,
      };
      yield put(desicionCategorySuccess(responseData));
    } else {
      const responseData = {
        data: response.data.error,
      };
      yield put(desicionCategoryError(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(desicionCategoryError(errorData));
  }
}

function* Interventionslist(action) {
  const phaseId = action.payload.phase;
  const eventId = action.payload.event;
  const subEventId = action.payload.subEvent;
  const categoryId = action.payload.category;
  const activityId = action.payload.activity;
  let url = `${DESICION_API}/get_interventions?epidemic_phase_id=${phaseId}`;
  if (eventId !== null) {
    url += `&event_id=${eventId}`;
  }
  if (subEventId !== null) {
    url += `&sub_event_id=${subEventId}`;
  }
  if (categoryId !== null) {
    url += `&category_id=${categoryId}`;
  }
  if (activityId !== null) {
    url += `&activity_id=${activityId}`;
  }
  try {
    const apiResponse = baseMethod(AXIOS_INSTANCE_LOADER.get(url), "", "");

    const response = yield call(checkHttpStatus, apiResponse);
    if (response && response.status === 200) {
      const responseData = {
        statusCode: 200,
        data: response.data.result,
      };
      yield put(desicionInterventionsSuccess(responseData));
    } else {
      const responseData = {
        data: response.data.error,
      };
      yield put(desicionInterventionsError(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(desicionInterventionsError(errorData));
  }
}

export function* watchEpidemicList() {
  yield takeEvery(DESICION_CONST.DESICION_EPIDEMIC_REQUEST, epidemiclist);
}

export function* watchCategoryList() {
  yield takeEvery(DESICION_CONST.DESICION_CATEGORY_REQUEST, categorylist);
}

export function* watchInterventionsList() {
  yield takeEvery(DESICION_CONST.DESICION_INTERVENTIONS_REQUEST, Interventionslist);
}

function* DashboardSaga() {
  yield all([fork(watchEpidemicList), fork(watchCategoryList), fork(watchInterventionsList)]);
}

export default DashboardSaga;
