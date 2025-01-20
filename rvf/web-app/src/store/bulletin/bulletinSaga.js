import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import {
  addBulletinFailed,
  addBulletinSuccess,
  getBulletinSuccess,
  getBulletinFailed,
  shareBulletinSuccess,
  shareBulletinFailed,
  mailListSuccess,
  mailListFailed,
} from "./bulletinActions";
import BULLETIN_CONSTS from "./bulletinConst";
import { AXIOS_INSTANCE, BULLETIN_API, MAIL_API } from "../apiUtils/config";

const addBulletinApiRequest = async (payload) => {
  let response = {};
  try {
    const apiResponseData = await AXIOS_INSTANCE.post(`${BULLETIN_API}/add`, payload);
    response = {
      data: apiResponseData.data,
      status: 200,
    };
  } catch (error) {
    const data = error;
    response = {
      error: data,
      status: 400,
    };
  }
  return response;
};

function* addBulletin(action) {
  try {
    const response = yield call(addBulletinApiRequest, action.payload);
    if (response?.status === 200) {
      const responseData = {
        response: {
          statusCode: 200,
          data: response,
        },
      };
      yield put(addBulletinSuccess(responseData));
    } else if (response?.status === 400) {
      const responseData = {
        response: {
          statusCode: 200,
          data: response.error,
        },
      };
      yield put(addBulletinFailed(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(addBulletinFailed(errorData));
  }
}

const allBulletinApiRequest = async (payload) => {
  let response = {};
  try {
    // Initialize an empty array to store key-value pairs for non-empty values
    const queryParams = [];

    // Iterate over the payload.data object
    const { formData } = payload;

    // Iterate over the formData object
    for (const key in formData) {
      // Check if the value is not empty
      if (formData[key]) {
        // Push the key-value pair to the queryParams array
        queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(formData[key])}`);
      }
    }

    // Construct the query string by joining the queryParams array with '&'
    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
    const apiResponseData = await AXIOS_INSTANCE.get(
      `${BULLETIN_API}/getAllByCriteria${queryString}`,
      payload.data
    );
    response = {
      data: apiResponseData.data,
      status: 200,
    };
  } catch (error) {
    const data = error;
    response = {
      error: data,
      status: 400,
    };
  }
  return response;
};

function* getBulletinRequest(action) {
  try {
    const response = yield call(allBulletinApiRequest, action.payload);
    if (response) {
      const responseData = {
        response: {
          statusCode: 200,
          data: response.data,
        },
      };
      yield put(getBulletinSuccess(responseData));
    } else {
      const responseData = {
        response: { statusCode: 200, response: response.error },
      };
      yield put(getBulletinFailed(responseData));
    }
  } catch (error) {
    const errorData = { error: { statusText: error, netWorkError: true } };
    yield put(getBulletinFailed(errorData));
  }
}
const shareBulletinApiRequest = async (payload) => {
  let response = {};
  try {
    const apiResponseData = await AXIOS_INSTANCE.post(`${BULLETIN_API}/send_bulletin`, payload);
    response = {
      data: apiResponseData.data,
      status: 200,
    };
  } catch (error) {
    const data = error;
    response = {
      error: data,
      status: 400,
    };
  }
  return response;
};

function* shareBulletinRequest(action) {
  try {
    const response = yield call(shareBulletinApiRequest, action.payload);
    if (response) {
      const responseData = {
        response: {
          statusCode: 200,
          data: response.data,
        },
      };
      yield put(shareBulletinSuccess(responseData));
    } else {
      const responseData = {
        response: { statusCode: 200, response: response.error },
      };
      yield put(shareBulletinFailed(responseData));
    }
  } catch (error) {
    const errorData = { error: { statusText: error, netWorkError: true } };
    yield put(shareBulletinFailed(errorData));
  }
}

const mailApiRequest = async () => {
  let response = {};
  try {
    const apiResponseData = await AXIOS_INSTANCE.get(`${MAIL_API}`);
    response = {
      data: apiResponseData.data,
      status: 200,
    };
  } catch (error) {
    const data = error;
    response = {
      error: data,
      status: 400,
    };
  }
  return response;
};

function* mailList() {
  try {
    const response = yield call(mailApiRequest);
    if (response?.status === 200) {
      const responseData = {
        response: {
          statusCode: 200,
          data: response,
        },
      };
      yield put(mailListSuccess(responseData));
    } else if (response?.status === 400) {
      const responseData = {
        response: {
          statusCode: 200,
          data: response.error,
        },
      };
      yield put(mailListFailed(responseData));
    }
  } catch (error) {
    const errorData = {
      error: {
        statusText: error,
        netWorkError: true,
      },
    };
    yield put(mailListFailed(errorData));
  }
}

function* watchBulletin() {
  yield takeEvery(BULLETIN_CONSTS.ADD_BULLETIN_REQUEST, addBulletin);
  yield takeEvery(BULLETIN_CONSTS.GET_BULLETIN_REQUEST, getBulletinRequest);
  yield takeEvery(BULLETIN_CONSTS.SHARE_BULLETIN_REQUEST, shareBulletinRequest);
  yield takeEvery(BULLETIN_CONSTS.MAIL_LIST_REQUEST, mailList);
}
function* bulletinSaga() {
  yield all([fork(watchBulletin)]);
}
export default bulletinSaga;
