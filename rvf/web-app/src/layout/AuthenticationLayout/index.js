import React, { useEffect } from "react";
import { useOutlet, useLocation, useParams, useNavigate } from "react-router-dom";

import Header from "../../components/Common/header";
import SubHeader from "../../components/Common/subHeader";

function ClimberLayout() {
  const Outlet = useOutlet();
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  window.scrollTo(0, 0);

  const isHomePath = location.pathname === "/home";
  const isLoginPath = location.pathname === "/login";
  const isCreateBulletinPath = location.pathname == "/create-news-bulletin";
  const isPreviewPath = location.pathname === `/online-news-bulletin/${id}`;

  useEffect(() => {
    const value = localStorage.getItem("userDetails");

    if (!value) {
      navigate("/home");
    }
  }, []);

  return (
    <div className="layout-div">
      <Header />
      {!isHomePath && !isCreateBulletinPath && !isLoginPath && !isPreviewPath && <SubHeader />}
      <div className="second-container">{Outlet}</div>
    </div>
  );
}

export default ClimberLayout;
