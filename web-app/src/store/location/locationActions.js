import LOCATION_CONST from "./locationConst";

export const locationRequest = (data) => {
  return {
    type: LOCATION_CONST.LOCATION_REQUEST,
    payload: data,
  };
};
export const locationSuccess = (data) => {
  return {
    type: LOCATION_CONST.LOCATION_SUCCESS,
    payload: data,
  };
};
export const locationError = (error) => {
  return {
    type: LOCATION_CONST.LOCATION_ERROR,
    payload: error,
  };
};
export const locationstateRequest = (data) => {
  return {
    type: LOCATION_CONST.LOCATION_STATE_REQUEST,
    payload: data,
  };
};
export const locationstateSuccess = (data) => {
  return {
    type: LOCATION_CONST.LOCATION_STATE_SUCCESS,
    payload: data,
  };
};
export const locationstateError = (error) => {
  return {
    type: LOCATION_CONST.LOCATION_STATE_ERROR,
    payload: error,
  };
};

export const locationsubRequest = (data) => {
  return {
    type: LOCATION_CONST.LOCATION_SUB_REQUEST,
    payload: data,
  };
};
export const locationsubSuccess = (data) => {
  return {
    type: LOCATION_CONST.LOCATION_SUB_SUCCESS,
    payload: data,
  };
};
export const locationsubError = (error) => {
  return {
    type: LOCATION_CONST.LOCATION_SUB_ERROR,
    payload: error,
  };
};
