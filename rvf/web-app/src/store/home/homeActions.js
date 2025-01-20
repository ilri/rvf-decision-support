import HOME_CONST from "./homeConst";

export const homeBannerRequest = (payload) => {
  return {
    type: HOME_CONST.HOME_BANNER_REQUEST,
    payload,
  };
};
export const homeBannerSuccess = (user) => {
  return {
    type: HOME_CONST.HOME_BANNER_SUCCESS,
    payload: user,
  };
};
export const homeBannerError = (error) => {
  return {
    type: HOME_CONST.HOME_BANNER_ERROR,
    payload: error,
  };
};

export const homeGenralToolsRequest = (data) => {
  return {
    type: HOME_CONST.HOME_GENERAL_TOOLS_REQUEST,
    payload: data,
  };
};
export const homeGenralToolsSuccess = (user) => {
  return {
    type: HOME_CONST.HOME_GENERAL_TOOLS_SUCCESS,
    payload: user,
  };
};
export const homeGenralToolsError = (error) => {
  return {
    type: HOME_CONST.HOME_GENERAL_TOOLS_ERROR,
    payload: error,
  };
};
