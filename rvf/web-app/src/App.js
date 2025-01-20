import React from "react";
import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { dashboardRoutes, AuthenticationRoutes } from "./routes/allRoutes";
import AuthicationLayout from "./layout/AuthenticationLayout";
import NonAuthenticationLayout from "./layout/NonAuthenticationLayout";

function App() {
  return (
    <Routes>
      <Route element={<AuthicationLayout />}>
        {dashboardRoutes.map((eachComponent) => (
          <Route
            path={eachComponent.path}
            element={eachComponent.component}
            key={eachComponent.path}
          />
        ))}
      </Route>

      <Route element={<NonAuthenticationLayout />}>
        {AuthenticationRoutes.map((eachComponent) => (
          <Route
            path={eachComponent.path}
            element={eachComponent.component}
            key={eachComponent.path}
          />
        ))}
      </Route>
      <Route path="/" element={<Navigate to="home" replace />} />
    </Routes>
  );
}

export default App;
