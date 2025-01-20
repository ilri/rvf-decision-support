import DESICION_CONST from "./decisionConst";

export const desicionEpidemicRequest = (data) => {
  return {
    type: DESICION_CONST.DESICION_EPIDEMIC_REQUEST,
    payload: data,
  };
};
export const desicionEpidemicSuccess = (data) => {
  return {
    type: DESICION_CONST.DESICION_EPIDEMIC_SUCCESS,
    payload: data,
  };
};
export const desicionEpidemicError = (error) => {
  return {
    type: DESICION_CONST.DESICION_EPIDEMIC_ERROR,
    payload: error,
  };
};

export const desicionCategoryRequest = (data) => {
  return {
    type: DESICION_CONST.DESICION_CATEGORY_REQUEST,
    payload: data,
  };
};
export const desicionCategorySuccess = (data) => {
  return {
    type: DESICION_CONST.DESICION_CATEGORY_SUCCESS,
    payload: data,
  };
};
export const desicionCategoryError = (error) => {
  return {
    type: DESICION_CONST.DESICION_CATEGORY_ERROR,
    payload: error,
  };
};

export const desicionInterventionsRequest = (data) => {
  return {
    type: DESICION_CONST.DESICION_INTERVENTIONS_REQUEST,
    payload: data,
  };
};
export const desicionInterventionsSuccess = (data) => {
  return {
    type: DESICION_CONST.DESICION_INTERVENTIONS_SUCCESS,
    payload: data,
  };
};
export const desicionInterventionsError = (error) => {
  return {
    type: DESICION_CONST.DESICION_INTERVENTIONS_ERROR,
    payload: error,
  };
};
