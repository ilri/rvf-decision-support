import React from "react";
import Home from "../pages/Home";
import RainfallComponent from "../pages/Rainfall";
import ClimateEpidemicComponent from "../pages/Dashboard";
import DecisionSupportComponent from "../pages/Decision";
import OnlineBulletinComponent from "../pages/Bulletin";
import CreateBulletinComponent from "../pages/Bulletin/CreateBulletin";
import BulletinPreviewComponent from "../pages/Bulletin/bulletinPreview";
import RvfModelingComponent from "../pages/RvfModeling";
import Login from "../pages/Authentication";

export const dashboardRoutes = [
  {
    path: "/home",
    component: <Home />,
  },
  {
    path: "/rainfall",
    component: <RainfallComponent />,
  },
  {
    path: "/climate-epidemic",
    component: <ClimateEpidemicComponent />,
  },
  {
    path: "/decision-support",
    component: <DecisionSupportComponent />,
  },
  {
    path: "/online-news-bulletin",
    component: <OnlineBulletinComponent />,
  },
  {
    path: "/create-news-bulletin",
    component: <CreateBulletinComponent />,
  },
  {
    // Define the dynamic route for bulletin preview
    path: "/online-news-bulletin/:id",
    component: <BulletinPreviewComponent />,
  },
  {
    path: "/rvf-modelling",
    component: <RvfModelingComponent />,
  },
];

export const AuthenticationRoutes = [
  {
    path: "/login",
    component: <Login />,
  },
];

// export default dashboardRoutes;
