import axios from "axios";
/* eslint no-undef: "error" */
// eslint-disable-next-line no-undef
export const BASE_URL = `${process.env.REACT_APP_API_URL}`;

export const AXIOS_INSTANCE = axios.create({});

export const AXIOS_INSTANCE_LOADER = axios.create({});

AXIOS_INSTANCE_LOADER.defaults.headers["Content-Type"] = "application/json";

AXIOS_INSTANCE_LOADER.interceptors.request.use(function startLoaderRequest(config) {
  return config;
});

AXIOS_INSTANCE.defaults.headers["Content-Type"] = "application/json";

export const HOME_BANNER_API = `${BASE_URL}/home`;

export const LOCATION_API = `${BASE_URL}/location`;

export const DASHBOARD_API = `${BASE_URL}/dashboard`;

export const DESICION_API = `${BASE_URL}/decision_support`;

export const RainFall_API = `${BASE_URL}/rainfall`;

export const BULLETIN_API = `${BASE_URL}/bulletin`;

export const MAIL_API = `${BASE_URL}/mail_hub/email_group/list`;

export const Model_API = `${BASE_URL}/modeling/forcasted_map`;
