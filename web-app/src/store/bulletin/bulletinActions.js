import BULLETIN_CONSTS from "./bulletinConst";

export const addBulletinRequest = (data) => ({
  type: BULLETIN_CONSTS.ADD_BULLETIN_REQUEST,
  payload: data,
});

export const addBulletinSuccess = (response) => ({
  type: BULLETIN_CONSTS.ADD_BULLETIN_SUCCESS,
  payload: response,
});

export const addBulletinFailed = (error) => ({
  type: BULLETIN_CONSTS.ADD_BULLETIN_FAILED,
  payload: error,
});

export const getBulletinRequest = (data) => ({
  type: BULLETIN_CONSTS.GET_BULLETIN_REQUEST,
  payload: data,
});

export const getBulletinSuccess = (response) => ({
  type: BULLETIN_CONSTS.GET_BULLETIN_SUCCESS,
  payload: response,
});

export const getBulletinFailed = (error) => ({
  type: BULLETIN_CONSTS.GET_BULLETIN_FAILED,
  payload: error,
});

export const shareBulletinRequest = (data) => ({
  type: BULLETIN_CONSTS.SHARE_BULLETIN_REQUEST,
  payload: data,
});

export const shareBulletinSuccess = (response) => ({
  type: BULLETIN_CONSTS.SHARE_BULLETIN_SUCCESS,
  payload: response,
});

export const shareBulletinFailed = (error) => ({
  type: BULLETIN_CONSTS.SHARE_BULLETIN_FAILED,
  payload: error,
});

export const mailListRequest = (data) => ({
  type: BULLETIN_CONSTS.MAIL_LIST_REQUEST,
  payload: data,
});

export const mailListSuccess = (response) => ({
  type: BULLETIN_CONSTS.MAIL_LIST_SUCCESS,
  payload: response,
});

export const mailListFailed = (error) => ({
  type: BULLETIN_CONSTS.MAIL_LIST_FAILED,
  payload: error,
});
