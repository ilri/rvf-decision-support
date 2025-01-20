import { all } from "redux-saga/effects";
import HomeSaga from "./home/homeSaga";
import LocationSaga from "./location/locationSaga";
import DashboardSaga from "./dashboard/dashboardSaga";
import DecisionSaga from "./decision/decisionSaga";
import bulletinSaga from "./bulletin/bulletinSaga";

export default function* rootSaga() {
  yield all([HomeSaga(), LocationSaga(), DashboardSaga(), DecisionSaga(), bulletinSaga()]);
}
