import { combineReducers } from "redux";
import Home from "./home/homeReducers";
import Loader from "./loader/reducer";
import Location from "./location/locationReducer";
import Dashboard from "./dashboard/dashboardReducer";
import Decision from "./decision/decisionReducer";
import Bulletin from "./bulletin/bulletinReducer";

const rootReducer = combineReducers({
  Home,
  Loader,
  Location,
  Dashboard,
  Decision,
  Bulletin,
});
export default rootReducer;
